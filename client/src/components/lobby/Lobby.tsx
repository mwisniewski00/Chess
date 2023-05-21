import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import "./Lobby.scss";
import { GameList } from "./game-list/GameList";
import clock from "assets/images/clock.png";
import turtle from "assets/images/turtle.png";

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const initiateGame = async (timed: boolean) => {
    await axiosPrivate
      .post("/games", {
        timed,
      })
      .then(res => {
        navigate(`/${res.data.id}`);
      });
  };
  return (
    <div className="lobby">
      <h2>Create a Game!</h2>
      <div className="lobby__box-container">
        <div className="mode-box" onClick={() => initiateGame(false)}>
          <div className="image-box">
            <div className="box-text">Play a slow game.</div>
            <img src={turtle} alt="clock icon" />
          </div>
        </div>
        <div className="mode-box" onClick={() => initiateGame(true)}>
          <div className="image-box">
            <div className="box-text">Play a timed game.</div>
            <img src={clock} alt="clock icon" />
          </div>
        </div>
      </div>
      <GameList />
    </div>
  );
};
