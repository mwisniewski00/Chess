import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink } from "./nav-link/NavLink";
import { useLocation } from "react-router-dom";
import "./Navbar.scss";
import { UserModal } from "../user/modal/UserModal";

interface SelectedLinks {
  [key: string]: "selected" | "not-selected";
}

export const Navbar: React.FC = () => {
  const [selectedLinks, setSelectedLinks] = useState<SelectedLinks>({
    home: "not-selected",
    lobby: "not-selected",
    profile: "not-selected",
  });

  const location = useLocation();

  useLayoutEffect(() => {
    const links = { ...selectedLinks };
    Object.keys(links).forEach(key => {
      links[key] = "not-selected";
    });
    links[location.pathname.slice(1)] = "selected";
    setSelectedLinks(links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar__logo__section">
        <div className="navbar__logo"></div>
        <div className="navbar__title">ChessMasters</div>
      </div>
      <div className="navbar__menu">
        <NavLink
          link="/"
          text="Home"
          selected={selectedLinks.home === "selected"}
        />
        <NavLink
          link="/lobby"
          text="Lobby"
          selected={selectedLinks.lobby === "selected"}
        />
        <NavLink
          link="/profile"
          text="Profile"
          selected={selectedLinks.profile === "selected"}
        />
        <div className="linkContainer">
          <div
            onClick={() => setOpenModal(true)}
            className="navbar__menu__item"
          >
            Login / Register
          </div>
          <UserModal open={openModal} setOpen={setOpenModal} />
        </div>
      </div>
    </div>
  );
};
