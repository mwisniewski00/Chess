import useUserModal from "hooks/useUserModal";
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./HeroButton.scss";
// import useAxiosPrivate from "hooks/useAxiosPrivate";

const HeroButton: React.FC = () => {
  // const axiosPrivate = useAxiosPrivate();

  // const test = async () => {
  //   try {
  //     const response = await axiosPrivate.get("/users");
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const { setIsOpen } = useUserModal();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (Object.keys(auth).length === 0) {
      setIsOpen(true);
    } else {
      navigate("/lobby");
    }
  };

  return (
    <div className="hero-button">
      <button onClick={() => handleGetStarted()}>Start Now</button>
    </div>
  );
};

export default HeroButton;
