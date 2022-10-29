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

  private getPossiblePawnMoves(row: number, column: number, color: Colors) {
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

  private getPossibleMoves(
    row: number,
    column: number,
    field: GameStateField | null,
  ) {
    if (!field) return [];
    if (field.piece === ChessPieces.PAWN) {
      return this.getPossiblePawnMoves(row, column, field.color);
    }
    return [];
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
