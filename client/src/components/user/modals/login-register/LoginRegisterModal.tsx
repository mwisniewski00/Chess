import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import { Login } from "../../login/Login";
import { Registration } from "../../registration/Registration";
import "./LoginRegisterModal.scss";
import IUserModalProps from "../../../../models/IUserModalProps"

export const LoginRegisterModal: React.FC<IUserModalProps> = ({ isOpen, setIsOpen }) => {
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
          padding: 0,
          margin: 0,
        },
      }}
      className="dialog"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogContent className="dialog-content-user">
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
