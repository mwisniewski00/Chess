import { useGameContext } from "components/Game/GameProvider";
import useSocketClient from "hooks/useSocketClient";
import { useEffect, useState } from "react";
import useAuth from "hooks/useAuth";
import IGameEnd from "models/websocket/IGameEnd";
import GameOverDialog from "./dialogs/game-over-dialog/GameOverDialog";
import IPlayer from "models/game/IPlayer";

export type playerGameStatus = {
  username: string;
  ratingDiff: number;
  status: "win" | "loss" | "draw";
} | null;

const GameOver: React.FC = () => {
  const {
    game,
    players: { playerBlack, playerWhite },
  } = useGameContext();
  const auth = useAuth().auth;

  const localPlayer =
    playerBlack?.username === auth.username ? playerBlack : playerWhite;

  const socket = useSocketClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerGameStatus, setPlayerGameStatus] =
    useState<playerGameStatus>(null);
  const [enemyGameStatus, setEnemyGameStatus] =
    useState<playerGameStatus>(null);

  useEffect(() => {
    socket.on(`game_end${game.id}`, (gameEndInfo: IGameEnd) => {
      const localPlayerGameStatus =
        gameEndInfo.player1.username === auth.username
          ? gameEndInfo.player1
          : gameEndInfo.player2;
      const enemyPlayerGameStatus =
        gameEndInfo.player1.username === auth.username
          ? gameEndInfo.player2
          : gameEndInfo.player1;

      setPlayerGameStatus(localPlayerGameStatus as playerGameStatus);
      setEnemyGameStatus(enemyPlayerGameStatus as playerGameStatus);

      setIsOpen(true);
    });

    return () => {
      socket.off(`game_end${game.id}`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <GameOverDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        playerGameStatus={playerGameStatus}
        enemyGameStatus={enemyGameStatus}
        localPlayer={localPlayer as IPlayer}
      />
    </div>
  );
};

export default GameOver;
