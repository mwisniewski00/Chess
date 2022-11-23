import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Lobby } from "components/lobby/Lobby";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import useAuth from "hooks/useAuth";

const JoinGame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayer, setIsPlayer] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const auth = useAuth();
  const gameId = useParams().id;

  console.log("ISLOADING", isLoading);
  console.log("ISPLAYER:", isPlayer);

  useEffect(() => {
    console.log("USEEFFECT");
    const joinGame = async () => {
      try {
        console.log("AUTH: ", auth);
        console.log("ID: ", gameId);
        const joinAttempt = await axiosPrivate.put(`/games/join/${gameId}`, {
          auth,
        });
        console.log("JOIN ATTEMPT: ", joinAttempt);
        if (joinAttempt.status === 200) {
          setIsPlayer(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    joinGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isPlayer === true} ? <Outlet /> : <Navigate to="/lobby" replace />
        </>
      )}
    </>
  );
};

export default JoinGame;
