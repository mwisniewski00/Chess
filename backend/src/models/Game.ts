import { Schema, model } from "mongoose";
import IPlayer from "./Player";
import * as nanoid from "nanoid";

interface IGame {
  _id: string;
  playerWhite: IPlayer | null;
  playerBlack: IPlayer | null;
}

const gameSchema = new Schema<IGame>({
  _id: {
    type: String,
    default: nanoid.nanoid(8),
  },
  playerWhite: {
    type: Object,
  },
  playerBlack: {
    type: Object,
  },
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
