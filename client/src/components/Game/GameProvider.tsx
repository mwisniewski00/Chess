import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLayoutEffect,
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import IGame from "models/game/IGame";
import useSocketClient from "hooks/useSocketClient";
import IPlayerConnected from "models/websocket/IPlayerConnected";
import { Game as GameInstance } from "chess-easy";
import IChatMessage from "models/websocket/IChatMessage";

interface GameProviderContext {
  game: IGame;
  color: string;
  players: IPlayerConnected;
  chat: IChatMessage[];
  setChat: React.Dispatch<React.SetStateAction<IChatMessage[]>>;
  sendMove: (from: string, to: string, promotion?: string) => Promise<boolean>;
  gameInstance: GameInstance;
}

interface GameContextProviderProps {
  children: React.ReactNode;
}

interface Move {
  from: string;
  to: string;
  promotion: string;
}

const GameContext = createContext<GameProviderContext | null>(null);

export const GameProvider = ({ children }: GameContextProviderProps) => {
  const [game, setGame] = useState<IGame>();
  const [color, setColor] = useState<string>();
  const [players, setPlayers] = useState<IPlayerConnected>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const auth = useAuth().auth;
  const gameId = useParams().id;
  const socket = useSocketClient();
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<IChatMessage[]>([]);
  const [gameInstance, setGameInstance] = useState<GameInstance>();
  const [lastMove, setLastMove] = useState<Move>();

  useLayoutEffect(() => {
    const joinGame = async () => {
      try {
        setIsLoading(true);
        const joinAttempt = await axiosPrivate.put(`/games/join/${gameId}`, {
          auth,
        });

        if (joinAttempt.status === 200) {
          const { fen, chat, playerWhite, playerBlack, _id, ...rest } =
            joinAttempt.data.game;
          setChat(chat);
          setPlayers({ playerBlack, playerWhite });
          const gameInstance = new GameInstance(...(fen ? [fen] : []));
          setGameInstance(gameInstance);
          setGame({
            ...rest,
            id: _id,
            gameState: gameInstance.getGameStateObject(),
            possibleMoves: getPossibleMoves(gameInstance),
          });
          if (playerWhite?.username === auth.username) {
            setColor("white");
          } else if (playerBlack?.username === auth.username) {
            setColor("black");
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        navigate("/lobby");
      }
    };

    joinGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPossibleMoves = useCallback(
    (gameInstance: GameInstance) => {
      if (!players || !Object.values(players).every(value => value))
        return null;
      return gameInstance.getNextColor() === color
        ? gameInstance.possibleMoves
        : null;
    },
    [color, players],
  );

  useEffect(() => {
    if (game && gameInstance) {
      if (lastMove) {
        const { from, to, promotion } = lastMove;
        gameInstance.move(from, to, promotion);
      }
      setGame({
        id: game.id,
        gameState: gameInstance.getGameStateObject(),
        possibleMoves: getPossibleMoves(gameInstance),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameInstance, getPossibleMoves, lastMove]);

  useEffect(() => {
    socket.on(`player_connected${gameId}`, (player: IPlayerConnected) => {
      setPlayers(prev => ({ ...prev, ...player }));
    });
    socket.on(`game/${gameId}/move`, setLastMove);

    return () => {
      socket.off(`player_connected${gameId}`);
      socket.off(`game/${gameId}/move`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMove = async (
    from: string,
    to: string,
    promotion: string = "q",
  ) => {
    try {
      await axiosPrivate.post(`/games/${gameId}/move`, {
        auth,
        from,
        to,
        promotion,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!game || !color || !players || !chat || !gameInstance) {
    return <div>Error!</div>;
  }

  return (
    <GameContext.Provider
      value={{ game, color, players, chat, setChat, sendMove, gameInstance }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("Game Context not initialized!");
  }
  return context;
}

export default GameProvider;
