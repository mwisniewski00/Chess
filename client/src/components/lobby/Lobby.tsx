import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import "./Lobby.scss";
import Button from "@mui/material/Button";

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const initiateGame = async () => {
    try {
      const initiatedGame = await axiosPrivate.post("/games");
      navigate(`/${initiatedGame.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="lobby">
      <h2>Lobby coming soon..</h2>
      <Button
        color="success"
        variant="contained"
        onClick={() => initiateGame()}
      >
        Play
      </Button>
    </div>
  );
};
