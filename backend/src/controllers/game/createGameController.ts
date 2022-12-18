import { Response, Request } from "express";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game from "../../models/Game";

const createGameController = {
  handleCreateGame: async (req: Request, res: Response) => {
    try {
      const game = await Game.create({
        playerWhite: null,
        playerBlack: null,
      });

      res.status(201).json({ id: game._id });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default createGameController;
