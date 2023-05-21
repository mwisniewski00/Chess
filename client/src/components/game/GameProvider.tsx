import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import IGame from "models/game/IGame";
import useSocketClient from "hooks/useSocketClient";
import IPlayerConnectedData from "models/websocket/IPlayerConnected";
import { Game as GameInstance, PromotionPossibility } from "chess-easy";
import IChatMessage from "models/websocket/IChatMessage";
import { ITimers } from "types";

interface GameProviderContext {
  game: IGame;
  color: "white" | "black";
  players: IPlayerConnectedData;
  chat: IChatMessage[];
  setChat: React.Dispatch<React.SetStateAction<IChatMessage[]>>;
  sendMove: (
    from: string,
    to: string,
    promotion?: PromotionPossibility,
  ) => void;
  gameInstance: GameInstance;
  isFinished: boolean;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
  timers: ITimers | null;
}

interface GameContextProviderProps {
  children: React.ReactNode;
}

interface Move {
  from: string;
  to: string;
  promotion: PromotionPossibility;
}

interface MoveMessage extends Move {
  timers?: ITimers;
}

const GameContext = createContext<GameProviderContext | null>(null);

export const GameProvider = ({ children }: GameContextProviderProps) => {
  const [game, setGame] = useState<IGame>();
  const [color, setColor] = useState<"white" | "black">();
  const [players, setPlayers] = useState<IPlayerConnectedData>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const auth = useAuth().auth;
  const gameId = useParams().id;
  const { socket } = useSocketClient();
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<IChatMessage[]>([]);
  const [gameInstance, setGameInstance] = useState<GameInstance>();
  const [lastMove, setLastMove] = useState<Move>();
  const [isFinished, setIsFinished] = useState(false);
  const [timers, setTimers] = useState<ITimers | null>(null);

  useEffect(() => {
    const joinGame = async () => {
      try {
        setIsLoading(true);
        const joinAttempt = await axiosPrivate.put(`/games/join/${gameId}`, {
          auth,
        });

        if (joinAttempt.status === 200) {
          const {
            fen,
            chat,
            playerWhite,
            playerBlack,
            _id,
            isFinished,
            whiteTimer,
            blackTimer,
            ...rest
          } = joinAttempt.data.game;
          setIsFinished(isFinished);
          setChat(chat);
          setPlayers({ playerBlack, playerWhite });
          const gameInstance = new GameInstance(fen || []);
          setGameInstance(gameInstance);
          setGame({
            ...rest,
            id: _id,
            gameState: gameInstance.getGameStateObject(),
            possibleMoves: getPossibleMoves(gameInstance),
          });
          if (whiteTimer && blackTimer) {
            setTimers({ white: whiteTimer, black: blackTimer });
          }
          if (playerWhite?.username === auth.username) {
            setColor("white");
          } else if (playerBlack?.username === auth.username) {
            setColor("black");
          }
        }
        setIsLoading(false);
      } catch (error) {
        navigate("/lobby");
      }
    };

    joinGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPossibleMoves = useCallback(
    (gameInstance: GameInstance) => {
      if (isFinished) return null;
      if (!players || !Object.values(players).every(value => value))
        return null;
      return gameInstance.getNextColor() === color
        ? gameInstance.possibleMoves
        : null;
    },
    [color, isFinished, players],
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

  const onMoveMessage = (message: MoveMessage) => {
    const { timers, ...move } = message;
    setLastMove(move);
    if (timers) {
      setTimers(timers);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(`player_connected`, (data: IPlayerConnectedData) => {
      setPlayers(prev => ({ ...prev, ...data }));
      if (data.timers) {
        setTimers(data.timers);
      }
    });
    socket.on(`move`, onMoveMessage);

    return () => {
      socket.off(`player_connected`);
      socket.off(`move`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!isLoading && socket) {
      socket.connect();
    }
  }, [isLoading, socket]);

  const sendMove = (
    from: string,
    to: string,
    promotion: string = PromotionPossibility.QUEEN,
  ) => {
    if (!isFinished) {
      socket?.emit("move", { from, to, promotion });
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
      value={{
        game,
        color,
        players,
        chat,
        setChat,
        sendMove,
        gameInstance,
        isFinished,
        setIsFinished,
        timers,
      }}
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
