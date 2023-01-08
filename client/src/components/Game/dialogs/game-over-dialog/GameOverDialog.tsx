import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./GameOverDialog.scss";
import defaultAvatar from "assets/images/default_profile.jpg";
import { playerGameStatus } from "components/Game/GameOver";
import IPlayer from "models/game/IPlayer";
import logo_white from "assets/images/logo_white.png";

interface GameOverDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerGameStatus: playerGameStatus;
  enemyGameStatus: playerGameStatus;
  localPlayer: IPlayer;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({
  isOpen,
  setIsOpen,
  playerGameStatus,
  enemyGameStatus,
  localPlayer,
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
          },
        }}
        className="dialog-game-over"
        open={isOpen}
        onClose={handleClose}
      >
        <DialogContent className="dialog-game-over-content">
          <img className="dialog-game__logo" src={logo_white} alt="logo"></img>
          {playerGameStatus && localPlayer && (
            <div className="end-game">
              <div className="end-game__status">
                {playerGameStatus.status === "win" && (
                  <div className="status-message win">You win!</div>
                )}
                {playerGameStatus.status === "loss" && (
                  <div className="status-message loss">You lose!</div>
                )}
                {playerGameStatus.status === "draw" && (
                  <div className="status-message draw">Draw!</div>
                )}
              </div>
              <div className="end-game__avatars">
                <div className="avatars__player local">
                  <img src={defaultAvatar} alt="player_avatar"></img>
                  <div className="avatars__name">{localPlayer.username}</div>
                </div>
                <div className="avatars__versus">vs</div>
                <div className="avatars__player opponent">
                  <img src={defaultAvatar} alt="player_avatar"></img>
                  <div className="avatars__name">
                    {enemyGameStatus?.username}
                  </div>
                </div>
              </div>
              <div className="end-game__ranking">
                <div className="ranking-new">
                  {(localPlayer.rating + playerGameStatus.ratingDiff) as number}
                </div>
                {playerGameStatus.ratingDiff > 0 && (
                  <div className="ranking-diff up">
                    +{playerGameStatus.ratingDiff}
                  </div>
                )}
                {playerGameStatus.ratingDiff === 0 && (
                  <div className="ranking-diff stay">+0</div>
                )}
                {playerGameStatus.ratingDiff < 0 && (
                  <div className="ranking-diff down">
                    {playerGameStatus.ratingDiff}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameOverDialog;
