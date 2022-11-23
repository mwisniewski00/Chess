import IGame from "components/models/IGame";
import useAuth from "hooks/useAuth";
import GameChat from "./game-chat/GameChat";
import InviteFriend from "./invite-friend/InviteFriend";
import PlayerWindow from "./player-window/PlayerWindow";
import "./PlayerSection.scss";

interface PlayerSectionProps {
  game: IGame;
  color: string;
}

const PlayerSection: React.FC<PlayerSectionProps> = ({ game, color }) => {
  const auth = useAuth().auth;

  return (
    <div className="player-section">
      {game.playerWhite && game.playerBlack ? (
        <PlayerWindow
          player={color === "white" ? game.playerBlack : game.playerWhite}
        />
      ) : (
        <InviteFriend />
      )}
      <GameChat />
      {game.playerWhite && game.playerWhite?.username === auth.username && (
        <PlayerWindow player={game.playerWhite} />
      )}
      {game.playerBlack && game.playerBlack?.username === auth.username && (
        <PlayerWindow player={game.playerBlack} />
      )}
    </div>
  );
};

export default PlayerSection;
