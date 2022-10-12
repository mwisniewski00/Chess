import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "./nav-link/NavLink";
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
        <NavLink link="/" text="Home" selected={selectedLinks.home === "selected"} />
        <NavLink link="/lobby" text="Lobby" selected={selectedLinks.lobby === "selected"} />
        <NavLink link="/profile" text="Profile" selected={selectedLinks.profile === "selected"} />
        <div className="linkContainer">
          <div className="navbar__menu__item">Login / Register</div>
        </div>
      </div>
    </div>
  );
};
