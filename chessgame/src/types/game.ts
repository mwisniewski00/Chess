import { ChessPieces, Colors } from "./common";

export interface GameStateField {
  color: Colors;
  piece: ChessPieces;
}

export type GameStateRow = [GameStateField | null];

export type GameState = [GameStateRow];
