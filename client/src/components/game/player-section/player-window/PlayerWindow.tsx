import IPlayer from "models/game/IPlayer";
import "./PlayerWindow.scss";
import defaultAvatar from "assets/images/default_profile.jpg";
import { ITimer } from "types";
import Timer from "components/game/player-section/player-window/Timer";

interface PlayerWindowProps {
  player: IPlayer;
  timer?: ITimer;
}

const PlayerWindow: React.FC<PlayerWindowProps> = ({ player, timer }) => {
  return (
    <div className="player-window">
      <div className="player-window__info">
        <img src={defaultAvatar} alt="player_avatar" />
        <div className="player-window__name">{player.username}</div>
        <div className="player-window__rating">
          ({Math.floor(player.rating)})
        </div>
      </div>
      {timer?.timeLeft ? <Timer timer={timer} /> : null}
    </div>
  );
};

export default PlayerWindow;
