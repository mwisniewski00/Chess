import "./Registration.scss";
import { RegistrationForm } from "./form/RegistrationForm";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

type Status = "idle" | "pending" | "resolved" | "rejected";

export const Registration: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <div className="registration">
      <div className="registration__top-section">
        <div className="registration__title">Join now!</div>
        <div className="registration__subtitle">
          Lorem ipsum dolor, sit amet consectetur.
        </div>
      </div>
      <div className="registration-status">
        {status === "pending" && (
          <div className="registration-status__pending">
            Please wait...
            <div className="progress-animation">
              <CircularProgress size={26} color="inherit" />
            </div>
          </div>
        )}
        {status === "resolved" && (
          <div className="registration-status__resolved">
            Registration successful!
            <div className="success-icon">
              <DoneIcon color="inherit" />
            </div>
          </div>
        )}
        {status === "rejected" && (
          <div className="registration-status__rejected">
            Something went wrong...
            <div className="error-icon">
              <CloseIcon color="inherit" />
            </div>
          </div>
        )}
      </div>
      <RegistrationForm />
    </div>
  );
};
