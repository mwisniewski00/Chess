import { Schema, model } from "mongoose";
import IPlayer from "./Player";

export interface IMessage {
  author: string | null;
  message: string;
}

export interface IGame {
  _id: string;
  playerWhite: IPlayer | null;
  playerBlack: IPlayer | null;
  chat: IMessage[];
  fen: string;
}

const gameSchema = new Schema<IGame>({
  _id: {
    type: String,
  },
  playerWhite: {
    type: Object,
  },
  playerBlack: {
    type: Object,
  },
  chat: [
    {
      author: String || null,
      message: String,
    },
  ],
  fen: {
    type: String,
    required: true,
  },
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
