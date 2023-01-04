import "./Registration.scss";
import { RegistrationForm } from "./form/RegistrationForm";
import { useState } from "react";
import StatusInfo, { Status } from "components/shared/status-info/StatusInfo";
import logo_white from "assets/images/logo_white.png";

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
        <img height={100} src={logo_white} alt="logo"></img>
        <div className="registration__title">Join now for free!</div>
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
