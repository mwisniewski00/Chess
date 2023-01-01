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
  } = useGameContext();
  return (
    <div className="player-section">
      {playerWhite && playerBlack ? (
        <PlayerWindow player={color === "white" ? playerBlack : playerWhite} />
      ) : (
        <InviteFriend />
      )}
      <GameChat />
      {playerWhite && playerWhite?.username === auth.username && (
        <PlayerWindow player={playerWhite} />
      )}
      {playerBlack && playerBlack?.username === auth.username && (
        <PlayerWindow player={playerBlack} />
      )}
    </div>
  );
};

export default PlayerSection;
