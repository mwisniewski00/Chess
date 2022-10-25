import "./Registration.scss";
import { RegistrationForm } from "./form/RegistrationForm";
import { useState } from "react";
import StatusInfo from "components/shared/status-info/StatusInfo";

export type Status = "idle" | "pending" | "resolved" | "rejected";

export interface Messages {
  pending: string;
  resolved: string;
  rejected: string;
}

export const Registration: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<Messages>({
    pending: "",
    resolved: "",
    rejected: "",
  });

  return (
    <div className="registration">
      <div className="registration__top-section">
        <div className="registration__title">Join now!</div>
        <div className="registration__subtitle">
          Lorem ipsum dolor, sit amet consectetur.
        </div>
      </div>
      <StatusInfo
        status={status}
        message={message}
        componentName={"registration"}
      />
      <RegistrationForm
        setStatus={setStatus}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};
