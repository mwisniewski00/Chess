import { useState } from "react";

import "./GameView.scss";
import Game from "../../chessgame/src/game/Game";
import { GameStateObject, PossibleMoves } from "../../chessgame/src/types/game";
import Chessboard from "./chess-board/Chessboard";
import IGame from "components/models/IGame";
import PlayerSection from "./player-section/PlayerSection";
const testGame = new Game();

interface GameViewProps {
  game: IGame;
  color: string | null;
}

export function GameView({ game, color }: GameViewProps) {
  const [gameState, setGameState] = useState<GameStateObject>(
    testGame.getGameStateObject(),
  );
  const [possibleMoves, setPossibleMoves] = useState<PossibleMoves>(
    testGame.possibleMoves,
  );

  const movePiece = (from: string, to: string) => {
    if (gameState[from]) {
      testGame.move(from, to);
      setGameState(testGame.getGameStateObject());
      setPossibleMoves(testGame.possibleMoves);
    }
  };

  return (
    <main>
      <section>
        <Chessboard
          gameState={gameState}
          movePiece={movePiece}
          possibleMoves={possibleMoves}
        />
        <PlayerSection game={game} color={color as string} />
      </section>
    </main>
  );
}
