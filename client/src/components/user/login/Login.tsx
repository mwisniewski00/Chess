import { useState } from "react";
import "./Login.scss";
import { LoginForm } from "./form/LoginForm";
import StatusInfo from "components/shared/status-info/StatusInfo";

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
      <StatusInfo status={status} message={message} componentName={"login"} />
      <LoginForm
        setStatus={setStatus}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};
