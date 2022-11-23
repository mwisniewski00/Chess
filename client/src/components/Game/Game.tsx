import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import { GameView } from "./GameView";
import { useLayoutEffect, useState } from "react";
import IGame from "components/models/IGame";

export const Game: React.FC = () => {
  const [game, setGame] = useState<IGame>({
    id: "",
    playerWhite: null,
    playerBlack: null,
  });
  const [color, setColor] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const auth = useAuth().auth;
  const gameId = useParams().id;

  useLayoutEffect(() => {
    const joinGame = async () => {
      try {
        console.log("AUTH: ", auth);
        console.log("ID: ", gameId);
        const joinAttempt = await axiosPrivate.put(`/games/join/${gameId}`, {
          auth,
        });
        console.log("JOIN ATTEMPT: ", joinAttempt);
        if (joinAttempt.status === 200) {
          setGame({ ...joinAttempt.data.game, id: joinAttempt.data.game._id });
          if (joinAttempt.data.game.playerWhite === auth.username) {
            setColor("white");
          } else if (joinAttempt.data.game.playerBlack === auth.username) {
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

  return (
    <div>
      <GameView game={game} color={color} />
    </div>
  );
};

export default Game;
