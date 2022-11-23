import { useEffect, useState } from "react";
import "./InviteFriend.scss";
import LinkIcon from "@mui/icons-material/Link";
import DoneIcon from "@mui/icons-material/Done";

const InviteFriend: React.FC = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyUrlButton = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };

  return (
    <div className="invite-friend">
      <div className="invite-friend__text">
        <div className="invite-friend__text__upper">
          Wait for someone to join...
        </div>
        <div className="invite-friend__text__lower">
          Or send this link to a friend!
        </div>
      </div>
      <div className="invite-friend__link-container">
        <div className="invite-friend__link">{window.location.href}</div>
        <button
          className={isCopied ? "copy-button copied" : "copy-button"}
          onClick={() => handleCopyUrlButton()}
        >
          {isCopied ? (
            <DoneIcon className="icon" />
          ) : (
            <LinkIcon className="icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InviteFriend;
