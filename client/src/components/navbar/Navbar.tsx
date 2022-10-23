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
          <a href="#" className="navbar__menu__item item__selected">
            Home
          </a>
          {selectedLinks.home === "selected" && (
            <div className="link__underline__container">
              <div className="link__underline link__underline__upper"></div>
              <div className="link__underline link__underline__lower"></div>
            </div>
          )}
        </div>
        <div className="linkContainer">
          <Link className="navbar__menu__item" to="/lobby">
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
          <a href="#" className="navbar__menu__item">
            Profile
          </a>
          {selectedLinks.profile === "selected" && (
            <div className="link_underline__container">
              <div className="link__underline link__underline__upper"></div>
              <div className="link__underline link__underline__lower"></div>
            </div>
          )}
        </div>
        <div className="linkContainer">
          <a href="#" className="navbar__menu__item item">
            Login / Register
          </a>
        </div>
      </div>
    </div>
  );
};
