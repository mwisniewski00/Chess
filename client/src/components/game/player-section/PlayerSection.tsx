import useAuth from "hooks/useAuth";
import { useGameContext } from "../GameProvider";
import GameChat from "./game-chat/GameChat";
import InviteFriend from "./invite-friend/InviteFriend";
import PlayerWindow from "./player-window/PlayerWindow";
import "./PlayerSection.scss";

const PlayerSection: React.FC = () => {
  const auth = useAuth().auth;
  const {
    players: { playerBlack, playerWhite },
    color,
    timers,
  } = useGameContext();

  return (
    <div className="player-section">
      {playerWhite && playerBlack ? (
        <PlayerWindow
          player={color === "white" ? playerBlack : playerWhite}
          timer={color === "white" ? timers?.black : timers?.white}
        />
      ) : (
        <InviteFriend />
      )}
      <GameChat />
      {playerWhite && playerWhite?.username === auth.username && (
        <PlayerWindow player={playerWhite} timer={timers?.white} />
      )}
      {playerBlack && playerBlack?.username === auth.username && (
        <PlayerWindow player={playerBlack} timer={timers?.black} />
      )}
    </div>
  );
};

export default PlayerSection;
