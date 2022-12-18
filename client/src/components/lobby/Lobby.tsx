import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import "./Lobby.scss";

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const initiateGame = async () => {
    try {
      const initiatedGame = await axiosPrivate.post("/games");
      // console.log(initiatedGame);
      navigate(`/${initiatedGame.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="lobby">
      <button onClick={() => initiateGame()}>CREATE TEST GAME</button>
    </div>
  );
};
