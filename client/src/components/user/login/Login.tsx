import { useState } from "react";
import "./Login.scss";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { LoginForm } from "./form/LoginForm";

type Status = "idle" | "pending" | "resolved" | "rejected";

export const Login: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <div className="login">
      <div className="login__top-section">
        <div className="login__title">Join now!</div>
        <div className="login__subtitle">
          Lorem ipsum dolor, sit amet consectetur.
        </div>
      </div>
      <div className="login-status">
        {status === "pending" && (
          <div className="login-status__pending">
            Please wait...
            <div className="progress-animation">
              <CircularProgress size={26} color="inherit" />
            </div>
          </div>
        )}
        {status === "resolved" && (
          <div className="login-status__resolved">
            Logged in!
            <div className="success-icon">
              <DoneIcon color="inherit" />
            </div>
          </div>
        )}
        {status === "rejected" && (
          <div className="login-status__rejected">
            Something went wrong...
            <div className="error-icon">
              <CloseIcon color="inherit" />
            </div>
          </div>
        )}
      </div>
      <LoginForm />
    </div>
  );
};
