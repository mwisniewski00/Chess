import { GameState, GameStateField } from "../types/game";
import { ChessPieces, Colors } from "../types/common";
import {
  mapColumnIndexToLetter,
  indexesToField,
  mapLetterToColumnIndex,
} from "../utils";

export class MovesGenerator {
  private gameState: GameState;
  private startingPawnIndexes = { [Colors.BLACK]: 6, [Colors.WHITE]: 1 };
  private enPassantPossibility: string;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  private getEnemyColor(color: Colors) {
    return color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  }

  private getPossiblePawnMoves(
    row: number,
    column: number,
    color: Colors,
  ): string[] {
    const colorMultiplier = color === Colors.BLACK ? -1 : 1;
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);
    const nextRow = row + colorMultiplier * 1;
    if (nextRow > 7 || nextRow < 0) {
      return [];
    }
    if (!this.gameState[nextRow][column]) {
      possibleMoves.push(indexesToField(nextRow, column));
    }
    const rowPlusTwo = row + colorMultiplier * 2;
    if (
      row === this.startingPawnIndexes[color] &&
      !this.gameState[nextRow][column] &&
      !this.gameState[rowPlusTwo][column]
    ) {
      possibleMoves.push(indexesToField(rowPlusTwo, column));
    }
    if (
      column < 7 &&
      this.gameState[nextRow][column + 1]?.color === enemyColor
    ) {
      possibleMoves.push(indexesToField(nextRow, column + 1));
    }
    if (
      column > 0 &&
      this.gameState[nextRow][column - 1]?.color === enemyColor
    ) {
      possibleMoves.push(indexesToField(nextRow, column - 1));
    }
    if (this.enPassantPossibility !== "-") {
      const [enPassantColumn] = this.enPassantPossibility.split("");
      const enPassantColumnIndex = mapLetterToColumnIndex(enPassantColumn);
      const isPieceColumnNextToEnPassant =
        Math.abs(enPassantColumnIndex - column) === 1;
      const isPieceRowNextToEnPassant =
        color === Colors.WHITE ? row === 4 : row === 3;
      if (isPieceColumnNextToEnPassant && isPieceRowNextToEnPassant) {
        possibleMoves.push(this.enPassantPossibility);
      }
    }
    return possibleMoves;
  }

  private getPossibleFigureMoves(
    row: number,
    column: number,
    color: number,
    patterns: any,
    oneMove: boolean = false,
  ) {
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);

    for (let n in patterns) {
      let nextRow: number = row + patterns[n][0];
      let nextColumn: number = column + patterns[n][1];
      while (true) {
        if (
          nextRow >= 0 &&
          nextRow <= 7 &&
          nextColumn >= 0 &&
          nextColumn <= 7
        ) {
          if (this.gameState[nextRow][nextColumn]?.color === enemyColor) {
            possibleMoves.push(indexesToField(nextRow, nextColumn));
            break;
          } else if (this.gameState[nextRow][nextColumn]?.color === color) {
            break;
          } else {
            possibleMoves.push(indexesToField(nextRow, nextColumn));
          }
        } else {
          break;
        }
        nextRow += patterns[n][0];
        nextColumn += patterns[n][1];
        if (oneMove) {
          break;
        }
      }
    }

    return possibleMoves;
  }

  private getPossibleMoves(
    row: number,
    column: number,
    field: GameStateField | null,
  ) {
    if (!field) return [];

    switch (field.piece) {
      case ChessPieces.PAWN: {
        return this.getPossiblePawnMoves(row, column, field.color);
      }
      case ChessPieces.KING: {
        return this.getPossibleFigureMoves(
          row,
          column,
          field.color,
          [
            [0, 1],
            [1, 0],
            [1, 1],
            [-1, -1],
            [0, -1],
            [-1, 0],
            [-1, 1],
            [1, -1],
          ],
          true,
        );
      }
      case ChessPieces.QUEEN: {
        return this.getPossibleFigureMoves(row, column, field.color, [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
          [0, 1],
          [1, 0],
          [-1, 0],
          [0, -1],
        ]);
      }
      case ChessPieces.BISHOP: {
        return this.getPossibleFigureMoves(row, column, field.color, [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]);
      }
      case ChessPieces.ROOK: {
        return this.getPossibleFigureMoves(row, column, field.color, [
          [0, 1],
          [1, 0],
          [-1, 0],
          [0, -1],
        ]);
      }
      case ChessPieces.KNIGHT: {
        return this.getPossibleFigureMoves(
          row,
          column,
          field.color,
          [
            [2, 1],
            [2, -1],
            [-2, 1],
            [-2, -1],
            [1, 2],
            [-1, 2],
            [1, -2],
            [-1, -2],
          ],
          true,
        );
      }
      default: {
        return [];
      }
    }
  }

  private areFieldsBetweenPiecesInRowEmpty(
    row: number,
    column1: number,
    column2: number,
  ) {
    const fieldsToCheck = this.gameState[row].slice(column1, column2);
    return fieldsToCheck.every(field => !field);
  }

  private addCastlingMoves(
    allPossibleMoves: object,
    castlingAvailability: string,
    movesNext: Colors,
  ) {
    const movesToUpdate = { ...allPossibleMoves };
    if (castlingAvailability.length) {
      const rowToCheck = movesNext === Colors.WHITE ? 0 : 7;
      const possibleEnemyMoves = this.getAllPossibleBasicMoves(
        this.getEnemyColor(movesNext),
      );
      const isQueenSidePossible =
        castlingAvailability.includes(movesNext === Colors.WHITE ? "Q" : "q") &&
        this.areFieldsBetweenPiecesInRowEmpty(rowToCheck, 1, 4) &&
        !this.willFieldBeAttacked(`c${rowToCheck + 1}`, possibleEnemyMoves);
      const isKingSidePossible =
        castlingAvailability.includes(movesNext === Colors.BLACK ? "K" : "k") &&
        this.areFieldsBetweenPiecesInRowEmpty(rowToCheck, 5, 7) &&
        !this.willFieldBeAttacked(`g${rowToCheck + 1}`, possibleEnemyMoves);

      const rookColumns = [
        ...(isQueenSidePossible ? ["a"] : []),
        ...(isKingSidePossible ? ["h"] : []),
      ];
      const kingField = `e${rowToCheck + 1}`;
      rookColumns.forEach(column => {
        const rookField = `${column}${rowToCheck + 1}`;
        movesToUpdate[rookField] = [
          ...((movesToUpdate[rookField] || []) as string[]),
          kingField,
        ];
        movesToUpdate[kingField] = [
          ...((movesToUpdate[kingField] || []) as string[]),
          rookField,
        ];
      });
    }
    return movesToUpdate;
  }

  private getAllPossibleBasicMoves(moves: Colors) {
    const allPossibleMoves = {};
    this.gameState.forEach((row, row_index) => {
      row.forEach((field, column_index) => {
        const piecePosition = `${mapColumnIndexToLetter(column_index)}${
          row_index + 1
        }`;
        if (field?.color !== moves) {
          allPossibleMoves[piecePosition] = [];
          return;
        }
        allPossibleMoves[piecePosition] = this.getPossibleMoves(
          row_index,
          column_index,
          field,
        );
      });
    });
    return allPossibleMoves;
  }

  private willFieldBeAttacked(field: string, enemyMoves: object) {
    return Object.values(enemyMoves).some(moves =>
      (moves as string[]).includes(field),
    );
  }

  public getAllPossibleMoves(
    movesNext: Colors,
    castlingAvailability: string,
    enPassantPossibility: string,
  ) {
    this.enPassantPossibility = enPassantPossibility;
    const basicMoves = this.getAllPossibleBasicMoves(movesNext);
    return this.addCastlingMoves(basicMoves, castlingAvailability, movesNext);
  }
}
