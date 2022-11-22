import { Response, Request } from "express";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game from "../../models/Game";

const gamesController = {
  handleGetGames: async (req: Request, res: Response) => {
    try {
      const games = await Game.find({}).lean();

      res.status(200).json({ games });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  handleGetGameById: async (req: Request, res: Response) => {
    const gameId = req.params.id;

    try {
      const game = await Game.findById(gameId).lean();

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      res.status(200).json({ game });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default gamesController;
