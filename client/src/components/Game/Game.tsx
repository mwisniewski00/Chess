import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import { GameView } from "./GameView";
import { useLayoutEffect, useState, useEffect } from "react";
import IGame from "components/models/game/IGame";
import useSocketClient from "hooks/useSocketClient";
import IPlayerConnected from "components/models/websocket/IPlayerConnected";

export const Game: React.FC = () => {
  const [game, setGame] = useState<IGame>({
    id: "",
    playerWhite: null,
    playerBlack: null,
    chat: [],
  });
  const [color, setColor] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const auth = useAuth().auth;
  const gameId = useParams().id;
  const socket = useSocketClient();

  useLayoutEffect(() => {
    const joinGame = async () => {
      try {
        const joinAttempt = await axiosPrivate.put(`/games/join/${gameId}`, {
          auth,
        });

        if (joinAttempt.status === 200) {
          setGame({ ...joinAttempt.data.game, id: joinAttempt.data.game._id });
          if (joinAttempt.data.game.playerWhite?.username === auth.username) {
            setColor("white");
          } else if (
            joinAttempt.data.game.playerBlack?.username === auth.username
          ) {
            setColor("black");
          }
        }
      } catch (error) {
        console.error(error);
        navigate("/lobby");
      }
    };

    joinGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on(`player_connected${gameId}`, (player: IPlayerConnected) => {
      setGame(prev => ({ ...prev, ...player }));
    });

    return () => {
      socket.off(`player_connected${gameId}`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {game.id !== "" && color ? (
        <GameView setGame={setGame} game={game} color={color} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Game;
