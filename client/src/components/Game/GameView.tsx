import { useState } from "react";
import Chessboard from "../ChessBoard/Chessboard";
import "./game.scss";

export interface ChessPiece {
  color: "WHITE" | "BLACK";
  piece: "PAWN" | "ROOK" | "KING" | "QUEEN" | "BISHOP" | "KNIGHT";
}

export interface GameState {
  [key: string]: ChessPiece;
}

export function GameView() {
  const [gameState, setGameState] = useState<GameState>({
    a1: { color: "WHITE", piece: "ROOK" },
    b1: { color: "WHITE", piece: "KNIGHT" },
    c1: { color: "WHITE", piece: "BISHOP" },
    d1: { color: "WHITE", piece: "QUEEN" },
    e1: { color: "WHITE", piece: "KING" },
    f1: { color: "WHITE", piece: "BISHOP" },
    g1: { color: "WHITE", piece: "KNIGHT" },
    h1: { color: "WHITE", piece: "ROOK" },
    a2: { color: "WHITE", piece: "PAWN" },
    b2: { color: "WHITE", piece: "PAWN" },
    c2: { color: "WHITE", piece: "PAWN" },
    d2: { color: "WHITE", piece: "PAWN" },
    e2: { color: "WHITE", piece: "PAWN" },
    f2: { color: "WHITE", piece: "PAWN" },
    g2: { color: "WHITE", piece: "PAWN" },
    h2: { color: "WHITE", piece: "PAWN" },
    a8: { color: "BLACK", piece: "ROOK" },
    b8: { color: "BLACK", piece: "KNIGHT" },
    c8: { color: "BLACK", piece: "BISHOP" },
    d8: { color: "BLACK", piece: "QUEEN" },
    e8: { color: "BLACK", piece: "KING" },
    f8: { color: "BLACK", piece: "BISHOP" },
    g8: { color: "BLACK", piece: "KNIGHT" },
    h8: { color: "BLACK", piece: "ROOK" },
    a7: { color: "BLACK", piece: "PAWN" },
    b7: { color: "BLACK", piece: "PAWN" },
    c7: { color: "BLACK", piece: "PAWN" },
    d7: { color: "BLACK", piece: "PAWN" },
    e7: { color: "BLACK", piece: "PAWN" },
    f7: { color: "BLACK", piece: "PAWN" },
    g7: { color: "BLACK", piece: "PAWN" },
    h7: { color: "BLACK", piece: "PAWN" },
  });

  const movePiece = (from: string, to: string) => {
    if (gameState[from]) {
      const newGameState = { ...gameState, [to]: gameState[from] };
      delete newGameState[from];
      setGameState(newGameState);
    }
  };

  return (
    <main>
      <section>
        <Chessboard gameState={gameState} movePiece={movePiece} />
      </section>
    </main>
  );
}
