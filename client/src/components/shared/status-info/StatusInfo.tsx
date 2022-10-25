import { Messages, Status } from "components/user/login/Login";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "./StatusInfo.scss";

interface StatusInfoProps {
  status: Status;
  message: Messages;
  componentName: string;
}

const StatusInfo: React.FC<StatusInfoProps> = ({
  status,
  message,
  componentName,
}) => {
  return (
    <div className={`status ${componentName}-status`}>
      {status === "pending" && (
        <div className="status__pending">
          {message.pending}
          <div className="progress-animation">
            <CircularProgress size={26} color="inherit" />
          </div>
        </div>
      )}
      {status === "resolved" && (
        <div className="status__resolved">
          {message.resolved}
          <div className="success-icon">
            <DoneIcon color="inherit" />
          </div>
        </div>
      )}
      {status === "rejected" && (
        <div className="status__rejected">
          {message.rejected}
          <div className="error-icon">
            <CloseIcon color="inherit" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusInfo;
