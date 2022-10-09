import "./chessboard.css";
import { GameState } from "src/App";
import Chesspiece from "./Chesspieces/Chesspiece";

interface ChessboardProps {
  gameState: GameState;
}

export default function Chessboard({ gameState }: ChessboardProps) {
  const rows = Array.from(Array(8).keys());
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div id="chessboard">
      {rows.map(row => (
        <div>
          {columns.map(column => (
            <div id={`field-${column}${row}`} className="chessfield">
              <Chesspiece column={column} row={row} gameState={gameState} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
