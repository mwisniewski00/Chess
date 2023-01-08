import IPlayer from "models/game/IPlayer";
import "./PlayerWindow.scss";
import defaultAvatar from "assets/images/default_profile.jpg";

interface PlayerWindowProps {
  player: IPlayer;
}

const PlayerWindow: React.FC<PlayerWindowProps> = ({ player }) => {
  return (
    <div className="player-window">
      <img src={defaultAvatar} alt="player_avatar"></img>
      <div className="player-window__info">
        <div className="player-window__name">{player.username}</div>
        <div className="player-window__rating">({player.rating})</div>
      </div>
    </div>
  );
};

export default PlayerWindow;
