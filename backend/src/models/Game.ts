import { Schema, model } from "mongoose";
import { IUser } from "./User";

const TEN_MINUTES = 60 * 1000;

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
  chat: IMessage[];
  fen: string;
  type: GameType;
  whiteTimer: Timer;
  blackTimer: Timer;
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
    type: Object,
    default: {
      timeLeft: TEN_MINUTES,
    },
  },
  blackTimer: {
    type: Object,
    default: {
      timeLeft: TEN_MINUTES,
    },
  },
  isFinished: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
