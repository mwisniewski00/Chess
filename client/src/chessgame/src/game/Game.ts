import { ChessPieces, Colors } from "../types/common";
import {
  GameState,
  GameStateObject,
  GameStateRow,
  PossibleMoves,
} from "../types/game";
import FenValidator from "./FenValidator";
import { MovesGenerator } from "./MovesGenerator";
import { mapColumnIndexToLetter, mapLetterToColumnIndex } from "../utils";

type FenFieldSymbol =
  | "p"
  | "r"
  | "n"
  | "b"
  | "q"
  | "k"
  | "P"
  | "R"
  | "N"
  | "B"
  | "Q"
  | "K";

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
  possibleMoves: PossibleMoves;
  private START_GAME_FEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  constructor(fen?: string) {
    this.fen = fen || this.START_GAME_FEN;
    this.fenToGameState(this.fen);
    this.possibleMoves = this.getAllPossibleMoves();
  }

  private parseGameStateRowFen = (gameRowFen: string) => {
    const symbols = gameRowFen.split("");
    return symbols.reduce((acc: GameStateRow, curr: string) => {
      const numberValue = Number(curr);
      return isNaN(numberValue)
        ? [...acc, fenSymbolsToPiecesMapping[curr as FenFieldSymbol]]
        : [...acc, ...(Array(numberValue).fill(null) as GameStateRow)];
    }, []);
  };

  private parseGameStateFen(gameStateFen: string): GameState {
    const rows = gameStateFen.split("/").reverse();
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

  private getAllPossibleMoves() {
    const movesGenerator = new MovesGenerator(this.gameState);
    return movesGenerator.getAllPossibleMoves(
      this.movesNext,
      this.castlingAvailability,
    );
  }

  public getGameStateObject(): GameStateObject {
    const gameStateObject = {};
    this.gameState.forEach((row, row_index) => {
      row.forEach((field, column_index) => {
        const piecePosition = `${mapColumnIndexToLetter(column_index)}${
          row_index + 1
        }`;
        if (field) {
          gameStateObject[piecePosition] = field;
        }
      });
    });
    return gameStateObject;
  }

  private removeCastilngIfRookStateChange(
    column_index: number,
    row_index: number,
  ) {
    const piece = this.gameState[row_index][column_index];
    if (
      [0, 7].includes(column_index) &&
      [0, 7].includes(row_index) &&
      piece?.piece === ChessPieces.ROOK
    ) {
      const castleSideToRemove = column_index === 0 ? "q" : "k";
      const castleToRemove =
        piece.color === Colors.WHITE
          ? castleSideToRemove.toLocaleUpperCase()
          : castleSideToRemove;
      this.castlingAvailability = this.castlingAvailability.replace(
        castleToRemove,
        "",
      );
    }
  }

  private removeCastlingFromColor(color: Colors) {
    const castleRegexToRemove = color === Colors.WHITE ? /[^A-Z]/g : /[^a-z]/g;
    this.castlingAvailability = this.castlingAvailability.replace(
      castleRegexToRemove,
      "",
    );
  }

  private revalidateCastlingAvailability(
    from_column_index: number,
    from_row_index: number,
    to_column_index: number,
    to_row_index: number,
  ) {
    const piece_moving = this.gameState[from_row_index][from_column_index];
    if (piece_moving?.piece === ChessPieces.KING) {
      this.removeCastlingFromColor(piece_moving.color);
    }
    this.removeCastilngIfRookStateChange(from_column_index, from_row_index);
    this.removeCastilngIfRookStateChange(to_column_index, to_row_index);
  }

  private handleCastling(
    from_column_index: number,
    from_row_index: number,
    to_column_index: number,
    to_row_index: number,
  ) {
    const movingPiece = this.gameState[from_row_index][from_column_index];
    const fieldToLand = this.gameState[to_row_index][to_column_index];
    const castlingRowIndex = this.movesNext === Colors.WHITE ? 0 : 7;
    let newKingIndex: number | null = null;
    let newRookIndex: number | null = null;
    let oldRookIndex: number | null = null;
    if (fieldToLand?.color === movingPiece?.color) {
      if (from_column_index === 0 || to_column_index === 0) {
        newKingIndex = 2;
        newRookIndex = 3;
        oldRookIndex = 0;
      }
      if (from_column_index === 7 || to_column_index === 7) {
        newKingIndex = 6;
        newRookIndex = 5;
        oldRookIndex = 7;
      }
      if (newKingIndex && newRookIndex && oldRookIndex !== null) {
        this.gameState[castlingRowIndex][newKingIndex] =
          this.gameState[castlingRowIndex][4];
        delete this.gameState[castlingRowIndex][4];
        this.gameState[castlingRowIndex][newRookIndex] =
          this.gameState[castlingRowIndex][oldRookIndex];
        delete this.gameState[castlingRowIndex][oldRookIndex];
      }
      movingPiece?.color && this.removeCastlingFromColor(movingPiece?.color);
      return true;
    } else {
      this.revalidateCastlingAvailability(
        from_column_index,
        from_row_index,
        to_column_index,
        to_row_index,
      );
      return false;
    }
  }

  public move(from: string, to: string) {
    if (this.possibleMoves[from].includes(to)) {
      const [from_column, from_row] = from.split("");
      const [to_column, to_row] = to.split("");
      const from_column_index = mapLetterToColumnIndex(from_column);
      const from_row_index = Number(from_row) - 1;
      const to_column_index = mapLetterToColumnIndex(to_column);
      const to_row_index = Number(to_row) - 1;
      if (
        !this.handleCastling(
          from_column_index,
          from_row_index,
          to_column_index,
          to_row_index,
        )
      ) {
        this.gameState[to_row_index][to_column_index] =
          this.gameState[from_row_index][from_column_index];
        delete this.gameState[from_row_index][from_column_index];
      }
      this.movesNext =
        this.movesNext === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
      this.possibleMoves = this.getAllPossibleMoves();
      return true;
    }
    return false;
  }
}

export default Game;
