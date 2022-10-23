/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ChessPieces, Colors } from "../types/common";
import { GameState, GameStateRow } from "../types/game";
import FenValidator from "./FenValidator";

const fenSymbolsToPiecesMapping = {
  p: { color: Colors.BLACK, piece: ChessPieces.PAWN },
  r: { color: Colors.BLACK, piece: ChessPieces.ROOK },
  n: { color: Colors.BLACK, piece: ChessPieces.KNIGHT },
  b: { color: Colors.BLACK, piece: ChessPieces.BISHOP },
  q: { color: Colors.BLACK, piece: ChessPieces.QUEEN },
  k: { color: Colors.BLACK, piece: ChessPieces.KING },
  P: { color: Colors.WHITE, piece: ChessPieces.PAWN },
  R: { color: Colors.WHITE, piece: ChessPieces.ROOK },
  N: { color: Colors.WHITE, piece: ChessPieces.KNIGHT },
  B: { color: Colors.WHITE, piece: ChessPieces.BISHOP },
  Q: { color: Colors.WHITE, piece: ChessPieces.QUEEN },
  K: { color: Colors.WHITE, piece: ChessPieces.KING },
};

class Game {
  fen: string;
  gameState: GameState;
  movesNext: Colors;
  castlingAvailability: string;
  enPassantPossibility: string;
  halfMoveClock: number;
  fullMoveNumber: number;

  constructor(fen: string) {
    this.fen = fen;
    this.fenToGameState(fen);
  }

  private parseGameStateRowFen = (gameRowFen: string) => {
    const symbols = gameRowFen.split("");
    return symbols.map(symbol => {
      const numberValue = Number(symbol);
      return isNaN(numberValue)
        ? fenSymbolsToPiecesMapping[symbol]
        : Array(numberValue).fill(null);
    }) as GameStateRow;
  };

  private parseGameStateFen(gameStateFen: string): GameState {
    const rows = gameStateFen.split("/");
    return rows.map(this.parseGameStateRowFen) as GameState;
  }

  private fenToGameState(fen: string) {
    if (!FenValidator.validateFen(fen)) {
      throw new Error("Fen string invalid");
    }
    const [
      gameState,
      movesNext,
      castlingAvailability,
      enPassantPossibility,
      halfMoveClock,
      fullMoveCounter,
    ] = fen.split(" ");
    this.movesNext = movesNext === "w" ? Colors.WHITE : Colors.BLACK;
    this.castlingAvailability = castlingAvailability;
    this.enPassantPossibility = enPassantPossibility;
    this.halfMoveClock = Number(halfMoveClock);
    this.fullMoveNumber = Number(fullMoveCounter);
    this.gameState = this.parseGameStateFen(gameState);
  }
}

export default Game;
