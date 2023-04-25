import { useState } from "react";
import "./GameView.scss";
import Chessboard from "./chess-board/Chessboard";
import PlayerSection from "./player-section/PlayerSection";
import { PromotionDialog } from "./dialogs/promotion-dialog/PromotionDialog";
import { useGameContext } from "./GameProvider";
import { PromotionPossibility } from "chess-easy";

export function GameView() {
  const { game, sendMove, gameInstance } = useGameContext();

  const [promotionDialogState, setPromotionDialogState] = useState({
    open: false,
    from: "",
    to: "",
  });

  const makeMove = (
    from: string,
    to: string,
    promotion: PromotionPossibility = PromotionPossibility.QUEEN,
  ) => {
    sendMove(from, to, promotion);
  };

  const movePiece = (from: string, to: string) => {
    if (game.gameState[from]) {
      if (gameInstance.isPromotionMove(from, to)) {
        setPromotionDialogState({ open: true, from, to });
      } else {
        makeMove(from, to);
      }
    }
  };

  const onPromotionChoice = (piece: PromotionPossibility) => {
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
          gameState={game.gameState}
          movePiece={movePiece}
          possibleMoves={game.possibleMoves}
        />
        <PlayerSection />
      </section>
    </main>
  );
}
