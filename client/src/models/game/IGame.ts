import { GameStateObject, PossibleMoves } from "chess-easy";

interface IGame {
  id: string;
  gameState: GameStateObject;
  possibleMoves: PossibleMoves | null;
}

export default IGame;
