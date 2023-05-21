import { Response, Request } from "express";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import Game from "../../models/Game";
import ExpressError from "../../helpers/ExpressError";

const gamesController = {
  handleGetGames: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user;

    const games = await Game.find({
      $or: [
        { playerWhite: null },
        { playerBlack: null },
        {
          $and: [
            { playerWhite: { $ne: null } },
            { playerBlack: { $ne: null } },
            {
              $or: [{ playerWhite: user }, { playerBlack: user }],
            },
            { isFinished: false },
          ],
        },
      ],
    }).lean();

    res.status(200).json({ games });
  },

  handleGetGameById: async (req: Request, res: Response) => {
    const gameId = req.params.id;

    const game = await Game.findById(gameId).lean();

    if (!game) {
      throw new ExpressError("Game not found", 404);
    }

    res.status(200).json({ game });
  },
};

export default gamesController;
