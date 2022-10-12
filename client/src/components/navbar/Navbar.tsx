import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

interface SelectedLinks {
  [key: string]: "selected" | "not-selected";
}

export const Navbar: React.FC = () => {
  const [selectedLinks, setSelectedLinks] = useState<SelectedLinks>({
    home: "selected",
    lobby: "not-selected",
    profile: "not-selected",
  });

  return (
    <div className="navbar">
      <div className="navbar__logo__section">
        <div className="navbar__logo"></div>
        <div className="navbar__title">ChessMasters</div>
      </div>
      <div className="navbar__menu">
        <div className="linkContainer">
          <Link to="/" className="navbar__menu__item item__selected">
            Home
          </Link>
          {selectedLinks.home === "selected" && (
            <div className="link__underline__container">
              <div className="link__underline link__underline__upper"></div>
              <div className="link__underline link__underline__lower"></div>
            </div>
          )}
        </div>
        <div className="linkContainer">
          <Link to="/lobby" className="navbar__menu__item">
            Lobby
          </Link>
          {selectedLinks.lobby === "selected" && (
            <div className="link_underline__container">
              <div className="link__underline link__underline__upper"></div>
              <div className="link__underline link__underline__lower"></div>
            </div>
          )}
        </div>
        <div className="linkContainer">
          <Link to="/profile" className="navbar__menu__item">
            Profile
          </Link>
          {selectedLinks.profile === "selected" && (
            <div className="link_underline__container">
              <div className="link__underline link__underline__upper"></div>
              <div className="link__underline link__underline__lower"></div>
            </div>
          )}
        </div>
        <div className="linkContainer">
          <div className="navbar__menu__item">Login / Register</div>
        </div>
      </div>
    </div>
  );
};
