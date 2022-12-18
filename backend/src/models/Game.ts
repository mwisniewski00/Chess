import { Schema, model } from "mongoose";
import IPlayer from "./Player";

interface IGame {
  playerWhite: IPlayer | null;
  playerBlack: IPlayer | null;
}

const gameSchema = new Schema<IGame>({
  playerWhite: {
    type: Object,
  },
  playerBlack: {
    type: Object,
  },
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
