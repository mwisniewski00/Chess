import { Response } from "express";
import { nanoid } from "nanoid";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import Game, { GameType } from "../../models/Game";

const TEN_MINUTES = 10 * 60 * 1000;

const createGameController = {
  handleCreateGame: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user;
    const timed = req.body.timed;

    const game = await Game.create({
      _id: nanoid(8),
      playerWhite: null,
      playerBlack: null,
      author: user?.username,
      timed: timed,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      type: timed ? GameType.WITH_TIMER : GameType.CLASSIC,
      whiteTimer: timed
        ? {
            timeLeft: TEN_MINUTES,
          }
        : null,
      blackTimer: timed
        ? {
            timeLeft: TEN_MINUTES,
          }
        : null,
    });

    res.status(201).json({ id: game._id });
  },
};

export default createGameController;
