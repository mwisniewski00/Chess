import "./Chessboard.scss";
import { useState, useCallback } from "react";
import { GameStateObject, PossibleMoves } from "chess-easy";
import Chesspiece from "./chesspieces/Chesspiece";
import { useGameContext } from "../GameProvider";

interface ChessboardProps {
  gameState: GameStateObject;
  movePiece: (from: string, to: string) => void;
  possibleMoves: PossibleMoves | null;
}

export default function Chessboard({
  gameState,
  movePiece,
  possibleMoves,
}: ChessboardProps) {
  const game = useGameContext();
  const rows =
    game.color === "white"
      ? Array.from({ length: 8 }, (_, i) => i + 1).reverse()
      : Array.from({ length: 8 }, (_, i) => i + 1);

  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const getCursorType = useCallback(
    (field: string) => {
      if (!possibleMoves) return "default";
      if (selectedPiece) {
        if (possibleMoves[selectedPiece].includes(field)) return "pointer";
        if (selectedPiece === field) return "default";
        return "not-allowed";
      }
      return possibleMoves[field].length ? "pointer" : "default";
    },
    [possibleMoves, selectedPiece],
  );

  const isHighlighted = useCallback(
    (field: string) => {
      if (!possibleMoves) return false;
      if (selectedPiece) {
        return (
          selectedPiece !== field &&
          possibleMoves[selectedPiece].includes(field)
        );
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
    if (!possibleMoves) return;
    if (!selectedPiece && possibleMoves[id].length) {
      setSelectedPiece(id);
    }
    if (selectedPiece) {
      if (possibleMoves[selectedPiece].includes(id)) {
        movePiece(selectedPiece, id);
      }
      setSelectedPiece(null);
    }
  };

  return (
    <div id="chessboard">
      {rows.map(row => (
        <div key={row}>
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
