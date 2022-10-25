import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import { Login } from "../login/Login";
import { Registration } from "../registration/Registration";
import "./UserModal.scss";

interface UserModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, setIsOpen }) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const changeTab = () => {
    if (tab === "login") {
      setTab("register");
    } else {
      setTab("login");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "transparent",
        },
      }}
      className="dialog"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogContent className="dialog-content">
        {tab === "login" && (
          <div className="log-in">
            <Login />
            <div className="switch-tabs">
              <div className="switch-tabs-text__left">
                Don't have an account?
              </div>
              <div
                onClick={() => changeTab()}
                className="switch-tabs-text__right"
              >
                Sign up!
              </div>
            </div>
          </div>
        )}
        {tab === "register" && (
          <div className="sign-up">
            <Registration />
            <div className="switch-tabs">
              <div className="switch-tabs-text__left">
                Already got an account?
              </div>
              <div
                onClick={() => changeTab()}
                className="switch-tabs-text__right"
              >
                Sign in!
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
