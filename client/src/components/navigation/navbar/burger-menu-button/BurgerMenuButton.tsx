import "./BurgerMenuButton.scss";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

interface BurgerMenuButtonProps {
  isBurgerMenuOpen: boolean;
  setIsBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BurgerMenuButton: React.FC<BurgerMenuButtonProps> = ({
  isBurgerMenuOpen,
  setIsBurgerMenuOpen,
}) => {
  const openBurgerMenu = () => {
    setIsBurgerMenuOpen(true);
  };

  const closeBurgerMenu = () => {
    setIsBurgerMenuOpen(false);
  };

  return (
    <div className="burger-menu-button">
      {!isBurgerMenuOpen && (
        <div onClick={() => openBurgerMenu()} className="burger-menu-button">
          {!isBurgerMenuOpen && (
            <MenuIcon fontSize="large" className="icon burger-icon" />
          )}
        </div>
      )}
      {isBurgerMenuOpen && (
        <div onClick={() => closeBurgerMenu()} className="burger-menu-button">
          {isBurgerMenuOpen && (
            <CloseIcon fontSize="large" className="icon close-icon" />
          )}
        </div>
      )}
    </div>
  );
};

export default BurgerMenuButton;
