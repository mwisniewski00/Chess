import { useLayoutEffect, useState } from "react";
import { NavLink } from "./nav-link/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { UserModal } from "../../user/modal/UserModal";
import useLogout from "hooks/useLogout";
import useAuth from "hooks/useAuth";
import useUserModal from "hooks/useUserModal";
import BurgerMenuButton from "./burger-menu-button/BurgerMenuButton";

interface SelectedLinks {
  [key: string]: "selected" | "not-selected";
}

export const Navbar: React.FC = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { isOpen, setIsOpen } = useUserModal();

  const signOut = () => {
    logout();
    navigate("/");
  };

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

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar__logo__section">
        <div className="navbar__logo"></div>
        <div className="navbar__title">ChessMasters</div>
      </div>
      <div
        className={
          isBurgerMenuOpen ? "navbar__menu burger-menu-active" : "navbar__menu"
        }
      >
        <NavLink
          link="/"
          text="Home"
          selected={selectedLinks.home === "selected"}
          setIsBurgerMenuOpen={setIsBurgerMenuOpen}
        />
        {auth.username && (
          <NavLink
            link="/lobby"
            text="Lobby"
            selected={selectedLinks.lobby === "selected"}
            setIsBurgerMenuOpen={setIsBurgerMenuOpen}
          />
        )}
        {auth.username && (
          <NavLink
            link="/profile"
            text="Profile"
            selected={selectedLinks.profile === "selected"}
            setIsBurgerMenuOpen={setIsBurgerMenuOpen}
          />
        )}
        {!auth.username && (
          <div
            onClick={() => setIsBurgerMenuOpen(false)}
            className="linkContainer"
          >
            <div onClick={() => setIsOpen(true)} className="navbar__menu__item">
              Login / Register
            </div>
            <UserModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        )}
        {auth.username && (
          <div
            onClick={() => setIsBurgerMenuOpen(false)}
            className="linkContainer"
          >
            <div onClick={() => signOut()} className="navbar__menu__item">
              Logout
            </div>
          </div>
        )}
      </div>
      <BurgerMenuButton
        isBurgerMenuOpen={isBurgerMenuOpen}
        setIsBurgerMenuOpen={setIsBurgerMenuOpen}
      />
    </div>
  );
};
