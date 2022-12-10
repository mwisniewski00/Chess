import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./PromotionDialog.scss";
import "../../hero-page/hero-button/HeroButton.scss";

interface PromotionDialogProps {
  isOpen: boolean;
  onPromotionChoice: (piece: string) => void;
}

export function PromotionDialog({
  isOpen,
  onPromotionChoice,
}: PromotionDialogProps) {
  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "transparent",
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
              <button onClick={() => onPromotionChoice("q")}>Queen</button>
            </div>
            <div className="hero-button">
              <button onClick={() => onPromotionChoice("r")}>Rook</button>
            </div>
            <div className="hero-button">
              <button onClick={() => onPromotionChoice("b")}>Bishop</button>
            </div>
            <div className="hero-button">
              <button onClick={() => onPromotionChoice("k")}>Knight</button>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
