import { GameState, GameStateField } from "../types/game";
import { ChessPieces, Colors } from "../types/common";
import { mapColumnIndexToLetter } from "../utils";

export class MovesGenerator {
  private gameState: GameState;
  private startingPawnIndexes = { [Colors.WHITE]: 6, [Colors.BLACK]: 1 };

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  private getEnemyColor(color: Colors) {
    return color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  }

  private indexesToField(row: number, column: number) {
    return `${mapColumnIndexToLetter(column)}${row + 1}`;
  }

  private getPossiblePawnMoves(
    row: number,
    column: number,
    color: Colors,
  ): string[] {
    const colorMultiplier = color === Colors.WHITE ? -1 : 1;
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);
    const nextRow = row + colorMultiplier * 1;
    if (nextRow > 7 || nextRow < 0) {
      return [];
    }
    if (!this.gameState[nextRow][column]) {
      possibleMoves.push(this.indexesToField(nextRow, column));
    }
    const rowPlusTwo = row + colorMultiplier * 2;
    if (
      row === this.startingPawnIndexes[color] &&
      !this.gameState[nextRow][column] &&
      !this.gameState[rowPlusTwo][column]
    ) {
      possibleMoves.push(this.indexesToField(rowPlusTwo, column));
    }
    if (
      column < 7 &&
      this.gameState[nextRow][column + 1]?.color === enemyColor
    ) {
      possibleMoves.push(this.indexesToField(nextRow, column + 1));
    }
    if (
      column > 0 &&
      this.gameState[nextRow][column - 1]?.color === enemyColor
    ) {
      possibleMoves.push(this.indexesToField(nextRow, column - 1));
    }
    return possibleMoves;
  }

  private getPossibleKnightMoves(row: number, column: number, color: number) {
    const possibleMoves: string[] = [];
    const patterns = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [-1, 2],
      [1, -2],
      [-1, -2],
    ];

    for (const n in patterns) {
      const nextRow: number = row + patterns[n][0];
      const nextColumn: number = column + patterns[n][1];

      if (
        nextRow >= 0 &&
        nextRow <= 7 &&
        nextColumn >= 0 &&
        nextColumn <= 7 &&
        this.gameState[nextRow][nextColumn]?.color !== color
      ) {
        possibleMoves.push(this.indexesToField(nextRow, nextColumn));
      }
    }

    return possibleMoves;
  }

  private getPossibleKingMoves(row: number, column: number, color: number) {
    const possibleMoves: string[] = [];
    const patterns = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [1, -1],
    ];

    for (const n in patterns) {
      const nextRow: number = row + patterns[n][0];
      const nextColumn: number = column + patterns[n][1];

      if (
        nextRow >= 0 &&
        nextRow <= 7 &&
        nextColumn >= 0 &&
        nextColumn <= 7 &&
        this.gameState[nextRow][nextColumn]?.color !== color
      ) {
        possibleMoves.push(this.indexesToField(nextRow, nextColumn));
      }
    }

    return possibleMoves;
  }

  private getPossibleRookMoves(row: number, column: number, color: number) {
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);
    const patterns = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];

    for (const n in patterns) {
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
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
            break;
          } else if (this.gameState[nextRow][nextColumn]?.color === color) {
            break;
          } else {
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
          }
        } else {
          break;
        }
        nextRow += patterns[n][0];
        nextColumn += patterns[n][1];
      }
    }

    return possibleMoves;
  }

  private getPossibleBishopMoves(row: number, column: number, color: number) {
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);
    const patterns = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const n in patterns) {
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
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
            break;
          } else if (this.gameState[nextRow][nextColumn]?.color === color) {
            break;
          } else {
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
          }
        } else {
          break;
        }
        nextRow += patterns[n][0];
        nextColumn += patterns[n][1];
      }
    }

    return possibleMoves;
  }

  private getPossibleQueenMoves(row: number, column: number, color: number) {
    const possibleMoves: string[] = [];
    const enemyColor = this.getEnemyColor(color);
    const patterns = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];

    for (const n in patterns) {
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
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
            break;
          } else if (this.gameState[nextRow][nextColumn]?.color === color) {
            break;
          } else {
            possibleMoves.push(this.indexesToField(nextRow, nextColumn));
          }
        } else {
          break;
        }
        nextRow += patterns[n][0];
        nextColumn += patterns[n][1];
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
        return this.getPossibleKingMoves(row, column, field.color);
      }
      case ChessPieces.QUEEN: {
        return this.getPossibleQueenMoves(row, column, field.color);
      }
      case ChessPieces.BISHOP: {
        return this.getPossibleBishopMoves(row, column, field.color);
      }
      case ChessPieces.ROOK: {
        return this.getPossibleRookMoves(row, column, field.color);
      }
      case ChessPieces.KNIGHT: {
        return this.getPossibleKnightMoves(row, column, field.color);
      }
      default: {
        return [];
      }
    }
  }

  public getAllPossibleMoves() {
    const allPossibleMoves = {};
    this.gameState.forEach((row, row_index) => {
      row.forEach((field, column_index) => {
        const piecePosition = `${mapColumnIndexToLetter(column_index)}${
          row_index + 1
        }`;
        allPossibleMoves[piecePosition] = this.getPossibleMoves(
          row_index,
          column_index,
          field,
        );
      });
    });
    return allPossibleMoves;
  }
}
