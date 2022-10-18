import { useState } from "react";
import "./Login.scss";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { LoginForm } from "./form/LoginForm";

export type Status = "idle" | "pending" | "resolved" | "rejected";

export interface Messages {
  pending: string;
  resolved: string;
  rejected: string;
}

export const Login: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<Messages>({
    pending: "",
    resolved: "",
    rejected: "",
  });

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
            {message.pending}
            <div className="progress-animation">
              <CircularProgress size={26} color="inherit" />
            </div>
          </div>
        )}
        {status === "resolved" && (
          <div className="login-status__resolved">
            {message.resolved}
            <div className="success-icon">
              <DoneIcon color="inherit" />
            </div>
          </div>
        )}
        {status === "rejected" && (
          <div className="login-status__rejected">
            {message.rejected}
            <div className="error-icon">
              <CloseIcon color="inherit" />
            </div>
          </div>
        )}
      </div>
      <LoginForm
        setStatus={setStatus}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};
