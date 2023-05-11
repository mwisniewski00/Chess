import "./Chessboard.scss";
import { useState, useCallback, useEffect } from "react";
import { GameStateObject, PossibleMoves } from "chess-easy";
import Chesspiece from "./chesspieces/Chesspiece";
import { useGameContext } from "../GameProvider";

interface ChessboardProps {
  gameState: GameStateObject;
  movePiece: (from: string, to: string) => void;
  possibleMoves: PossibleMoves | null;
}

const LIGHT_COLOR = "#e9ecef";
const DARK_COLOR = "#6c757d";

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

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--chessfield-color-first",
      game.color === "white" ? LIGHT_COLOR : DARK_COLOR,
    );
    root.style.setProperty(
      "--chessfield-color-second",
      game.color === "white" ? DARK_COLOR : LIGHT_COLOR,
    );
  }, [game.color]);

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
