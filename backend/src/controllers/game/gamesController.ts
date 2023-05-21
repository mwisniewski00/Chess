import { Response, Request } from "express";
import Game from "../../models/Game";
import ExpressError from "../../helpers/ExpressError";

const gamesController = {
  handleGetGames: async (req: Request, res: Response) => {
    const games = await Game.find({}).lean();

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
