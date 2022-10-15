import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Registration } from "../registration/Registration";
import "./UserModal.scss";

interface UserModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserModal: React.FC<UserModalProps> = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog className="dialog" open={open} onClose={handleClose}>
      <DialogContent className="dialog-content">
          <div className="sign-up">
            <Registration />
          </div>
      </DialogContent>
    </Dialog>
  );
};
