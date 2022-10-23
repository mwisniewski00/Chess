import "./chessboard.css";
import { GameState } from "src/App";
import Chesspiece from "./Chesspieces/Chesspiece";
import { useState, useMemo, useCallback } from "react";

interface ChessboardProps {
  gameState: GameState;
  movePiece: (from: string, to: string) => void;
}

export default function Chessboard({ gameState, movePiece }: ChessboardProps) {
  const rows = Array.from({ length: 8 }, (_, i) => i + 1).reverse();
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const possibleMoves = useMemo(() => ["e2", "d5", "b4", "c2", "g2"], []);

  const getCursorType = useCallback(
    (field: string) => {
      if (selectedPiece) {
        if (possibleMoves.includes(field)) return "pointer";
        if (selectedPiece === field) return "default";
        return "not-allowed";
      }
      return gameState[field] ? "pointer" : "default";
    },
    [gameState, possibleMoves, selectedPiece],
  );

  const isHighlighted = useCallback(
    (field: string) => {
      if (selectedPiece) {
        return selectedPiece !== field && possibleMoves.includes(field);
      }
      return false;
    },
    [selectedPiece, possibleMoves],
  );

  const isSelected = useCallback(
    (field: string) => selectedPiece === field,
    [selectedPiece],
  );

  const handleClick = (id: string) => {
    if (!selectedPiece && gameState[id]) {
      setSelectedPiece(id);
    }
    if (selectedPiece) {
      possibleMoves.includes(id)
        ? movePiece(selectedPiece, id)
        : setSelectedPiece(null);
    }
  };

  return (
    <div id="chessboard">
      {rows.map(row => (
        <div>
          {columns.map(column => {
            const field = `${column}${row}`;
            return (
              <div
                id={`field-${field}`}
                className={`chessfield ${
                  isHighlighted(field) ? "highlighted" : ""
                } ${isSelected(field) ? "selected" : ""}`}
                onClick={() => handleClick(field)}
                style={{ cursor: getCursorType(field) }}
                key={field}
              >
                <Chesspiece column={column} row={row} gameState={gameState} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
