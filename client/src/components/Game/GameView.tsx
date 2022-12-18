import { useState } from "react";

import "./game.scss";
import Game from "../../chessgame/src/game/Game";
import { GameStateObject, PossibleMoves } from "../../chessgame/src/types/game";
import Chessboard from "./chess-board/Chessboard";
const game = new Game();

export function GameView() {
  const [gameState, setGameState] = useState<GameStateObject>(
    game.getGameStateObject(),
  );
  const [possibleMoves, setPossibleMoves] = useState<PossibleMoves>(
    game.possibleMoves,
  );

  const movePiece = (from: string, to: string) => {
    if (gameState[from]) {
      game.move(from, to);
      setGameState(game.getGameStateObject());
      setPossibleMoves(game.possibleMoves);
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
      </section>
    </main>
  );
}
