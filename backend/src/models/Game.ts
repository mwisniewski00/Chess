import { Schema, model } from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  author: string | null;
  message: string;
}

export enum GameType {
  CLASSIC = "classic",
  WITH_TIMER = "with_timer",
}

export interface Timer {
  timeLeft: number;
  running?: number;
}

export interface IGame {
  _id: string;
  playerWhite: IUser["_id"];
  playerBlack: IUser["_id"];
  author: string;
  winner: string | null;
  timed: boolean;
  chat: IMessage[];
  fen: string;
  type: GameType;
  whiteTimer: Timer | null;
  blackTimer: Timer | null;
  isFinished: Boolean;
}

const gameSchema = new Schema<IGame>({
  _id: {
    type: String,
  },
  playerWhite: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  playerBlack: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  author: {
    type: String,
  },
  winner: {
    type: String,
    default: null,
  },
  timed: {
    type: Boolean,
    default: false,
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
  type: {
    type: String,
    required: true,
    enum: ["classic", "with_timer"],
  },
  whiteTimer: {
    type: Object || null,
  },
  blackTimer: {
    type: Object || null,
  },
  isFinished: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
