import { SocketProvider } from "context/SocketProvider";
import { useParams } from "react-router-dom";
import GameOver from "./GameOver";
import GameProvider from "./GameProvider";
import { GameView } from "./GameView";

const Game: React.FC = () => {
  const { id } = useParams();

  return (
    <SocketProvider path={`/game/${id}`} autoConnect={false}>
      <GameProvider>
        <GameOver />
        <GameView />
      </GameProvider>
    </SocketProvider>
  );
};

export default Game;
