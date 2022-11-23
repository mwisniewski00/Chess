import { useEffect, useState } from "react";
import "./InviteFriend.scss";

const InviteFriend: React.FC = () => {
  const [gameUrl, setGameUrl] = useState<string>(window.location.href);

  return (
    <div className="invite-friend">
      <div className="invite-friend__text">
        Pass this link, to invite someone to this game!
      </div>
      <div className="invite-friend__link-container">
        <div className="invite-friend__link">{window.location.href}</div>
        <button>Copy Link</button>
      </div>
    </div>
  );
};

export default InviteFriend;
