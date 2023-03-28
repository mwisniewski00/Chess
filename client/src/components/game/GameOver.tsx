import { useGameContext } from "components/game/GameProvider";
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
    players: { playerBlack, playerWhite },
    setIsFinished,
  } = useGameContext();
  const auth = useAuth().auth;

  const localPlayer =
    playerBlack?.username === auth.username ? playerBlack : playerWhite;

  const { socket } = useSocketClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playerGameStatus, setPlayerGameStatus] =
    useState<playerGameStatus>(null);
  const [enemyGameStatus, setEnemyGameStatus] =
    useState<playerGameStatus>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on(`game_end`, (gameEndInfo: IGameEnd) => {
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

      setIsFinished(true);
      setIsOpen(true);
    });

    return () => {
      socket.off(`game_end`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
