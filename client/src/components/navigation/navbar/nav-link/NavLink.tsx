import "./NavLink.scss";
import { Link } from "react-router-dom";

interface NavLinkProps {
  link: string;
  text: string;
  selected: boolean;
  setIsBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavLink: React.FC<NavLinkProps> = ({
  link,
  text,
  selected,
  setIsBurgerMenuOpen,
}) => {
  return (
    <div onClick={() => setIsBurgerMenuOpen(false)} className="linkContainer">
      <Link
        to={link}
        className={`navbar__menu__item ${selected ? "item__selected" : ""}`}
      >
        {text}
      </Link>
      {selected && (
        <div className="link__underline__container">
          <div className="link__underline link__underline__upper"></div>
          <div className="link__underline link__underline__lower"></div>
        </div>
      )}
    </div>
  );
};
