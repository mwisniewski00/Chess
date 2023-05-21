import Button from "@mui/material/Button";
import { axiosPrivate } from "api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameList.scss";

export const GameList: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const navigate = useNavigate();

  const getPlayersCount = (game: any) => {
    if (game.playerBlack && game.playerWhite) {
      return 2;
    } else if (game.playerBlack || game.playerWhite) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const getGames = async () => {
      await axiosPrivate.get("/games").then(res => {
        setGames(res.data.games);
      });
    };

    getGames();
  }, []);

  return (
    <div className="game-list">
      <div className="labels row">
        <div className="label column">Author</div>
        <div className="label column">Players</div>
        <div className="label column">Timed</div>
        <div className="label column">Join</div>
      </div>
      {games.map(game => (
        <div key={game._id} className="game row">
          <div className="author column">{game.author}</div>
          <div className="players column">{getPlayersCount(game)} / 2</div>
          <div className="timed column">{game.timed ? "Yes" : "No"}</div>
          <Button
            onClick={() => {
              navigate(`/${game._id}`);
            }}
            className="column"
          >
            Join
          </Button>
        </div>
      ))}
    </div>
  );
};
