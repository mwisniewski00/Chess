import { ChessPieces, Colors } from "../types/common";
import {
  GameState,
  GameStateObject,
  GameStateRow,
  PossibleMoves,
} from "../types/game";
import FenValidator from "./FenValidator";
import { MovesGenerator } from "./MovesGenerator";
import { indexesToField, mapColumnIndexToLetter } from "../utils";
import { MoveIndexes } from "./MoveIndexes";

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
      this.enPassantPossibility,
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

  private revalidateCastlingAvailability(moveIndexes: MoveIndexes) {
    const piece_moving =
      this.gameState[moveIndexes.from.row][moveIndexes.from.column];
    if (piece_moving?.piece === ChessPieces.KING) {
      this.removeCastlingFromColor(piece_moving.color);
    }
    this.removeCastilngIfRookStateChange(
      moveIndexes.from.column,
      moveIndexes.from.row,
    );
    this.removeCastilngIfRookStateChange(
      moveIndexes.to.column,
      moveIndexes.to.row,
    );
  }

  private handleCastling(moveIndexes: MoveIndexes) {
    const movingPiece =
      this.gameState[moveIndexes.from.row][moveIndexes.from.column];
    const fieldToLand =
      this.gameState[moveIndexes.to.row][moveIndexes.to.column];
    const castlingRowIndex = this.movesNext === Colors.WHITE ? 0 : 7;
    let newKingIndex: number | null = null;
    let newRookIndex: number | null = null;
    let oldRookIndex: number | null = null;
    if (fieldToLand?.color === movingPiece?.color) {
      if (moveIndexes.from.column === 0 || moveIndexes.to.column === 0) {
        newKingIndex = 2;
        newRookIndex = 3;
        oldRookIndex = 0;
      }
      if (moveIndexes.from.column === 7 || moveIndexes.to.column === 7) {
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
      this.revalidateCastlingAvailability(moveIndexes);
      return false;
    }
  }

  private handleEnPassantPossibility(moveIndexes: MoveIndexes) {
    const movingPiece =
      this.gameState[moveIndexes.from.row][moveIndexes.from.column];
    const rowDifference = Math.abs(moveIndexes.from.row - moveIndexes.to.row);
    if (movingPiece?.piece === ChessPieces.PAWN && rowDifference === 2) {
      const colorMultiplier = this.movesNext === Colors.BLACK ? 1 : -1;
      const enPassantField = indexesToField(
        moveIndexes.to.row + 1 * colorMultiplier,
        moveIndexes.to.column,
      );
      this.enPassantPossibility = enPassantField;
    } else {
      this.enPassantPossibility = "-";
    }
  }

  private handleEnPassantCapture(moveIndexes: MoveIndexes) {
    const movingPiece =
      this.gameState[moveIndexes.from.row][moveIndexes.from.column];
    if (
      movingPiece?.piece === ChessPieces.PAWN &&
      moveIndexes.to.field === this.enPassantPossibility
    ) {
      const colorMultiplier = this.movesNext === Colors.BLACK ? 1 : -1;
      delete this.gameState[moveIndexes.to.row + 1 * colorMultiplier][
        moveIndexes.to.column
      ];
    }
  }

  private getNewPiece(moveIndexes: MoveIndexes, promotion: string) {
    const movingPiece =
      this.gameState[moveIndexes.from.row][moveIndexes.from.column];
    const promotionRow = this.movesNext === Colors.BLACK ? 0 : 7;
    if (
      movingPiece?.piece === ChessPieces.PAWN &&
      moveIndexes.to.row === promotionRow
    ) {
      return fenSymbolsToPiecesMapping[
        this.movesNext === Colors.BLACK
          ? promotion
          : promotion.toLocaleUpperCase()
      ];
    }
    return this.gameState[moveIndexes.from.row][moveIndexes.from.column];
  }

  public move(from: string, to: string, promotion: string = "q") {
    if (this.possibleMoves[from].includes(to)) {
      const moveIndexes = new MoveIndexes(from, to);
      this.handleEnPassantCapture(moveIndexes);
      this.handleEnPassantPossibility(moveIndexes);
      if (!this.handleCastling(moveIndexes)) {
        const newPiece = this.getNewPiece(moveIndexes, promotion);
        this.gameState[moveIndexes.to.row][moveIndexes.to.column] = newPiece;
        delete this.gameState[moveIndexes.from.row][moveIndexes.from.column];
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
