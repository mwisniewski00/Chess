import { useState } from "react";

import "./GameView.scss";
import Game from "../../chessgame/src/game/Game";
import { GameStateObject, PossibleMoves } from "../../chessgame/src/types/game";
import Chessboard from "./chess-board/Chessboard";
import IGame from "components/models/game/IGame";
import PlayerSection from "./player-section/PlayerSection";
import { PromotionDialog } from "./dialogs/PromotionDialog";
const testGame = new Game();

interface GameViewProps {
  game: IGame;
  setGame: React.Dispatch<React.SetStateAction<IGame>>;
  color: string | null;
}

export function GameView({ game, setGame, color }: GameViewProps) {
  const [gameState, setGameState] = useState<GameStateObject>(
    testGame.getGameStateObject(),
  );
  const [possibleMoves, setPossibleMoves] = useState<PossibleMoves>(
    testGame.possibleMoves,
  );

  const [promotionDialogState, setPromotionDialogState] = useState({
    open: false,
    from: "",
    to: "",
  });

  const makeMove = (from: string, to: string, promotion: string = "q") => {
    testGame.move(from, to, promotion);
    setGameState(testGame.getGameStateObject());
    setPossibleMoves(testGame.possibleMoves);
  };

  const movePiece = (from: string, to: string) => {
    if (gameState[from]) {
      if (testGame.isPromotionMove(from, to)) {
        setPromotionDialogState({ open: true, from, to });
      } else {
        makeMove(from, to);
      }
    }
  };

  const onPromotionChoice = (piece: string) => {
    makeMove(promotionDialogState.from, promotionDialogState.to, piece);
    setPromotionDialogState({ open: false, from: "", to: "" });
  };

  return (
    <main id="game__view">
      <PromotionDialog
        isOpen={promotionDialogState.open}
        onPromotionChoice={onPromotionChoice}
      />
      <section className="chessboard__section">
        <Chessboard
          gameState={gameState}
          movePiece={movePiece}
          possibleMoves={possibleMoves}
        />
        <PlayerSection setGame={setGame} game={game} color={color as string} />
      </section>
    </main>
  );
}
