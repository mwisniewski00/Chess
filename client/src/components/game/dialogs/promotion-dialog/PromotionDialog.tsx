import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./PromotionDialog.scss";
import "../../../hero-page/hero-button/HeroButton.scss";
import { PromotionPossibility } from "chess-easy";

interface PromotionDialogProps {
  isOpen: boolean;
  onPromotionChoice: (piece: PromotionPossibility) => void;
}

export function PromotionDialog({
  isOpen,
  onPromotionChoice,
}: PromotionDialogProps) {
  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "rgb(25, 25, 25)",
          padding: 0,
          margin: 0,
        },
      }}
      className="dialog"
      open={isOpen}
      disableEscapeKeyDown={true}
      onClose={() => {}}
    >
      <DialogContent className="dialog-content">
        <section className="promotion__dialog">
          <h3>Choose promotion piece</h3>
          <div className="promotion__buttons">
            <div className="hero-button">
              <button
                onClick={() => onPromotionChoice(PromotionPossibility.QUEEN)}
              >
                Queen
              </button>
            </div>
            <div className="hero-button">
              <button
                onClick={() => onPromotionChoice(PromotionPossibility.ROOK)}
              >
                Rook
              </button>
            </div>
            <div className="hero-button">
              <button
                onClick={() => onPromotionChoice(PromotionPossibility.BISHOP)}
              >
                Bishop
              </button>
            </div>
            <div className="hero-button">
              <button
                onClick={() => onPromotionChoice(PromotionPossibility.KNIGHT)}
              >
                Knight
              </button>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
