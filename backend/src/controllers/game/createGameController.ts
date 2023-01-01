import { Response, Request } from "express";
import { nanoid } from "nanoid";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game from "../../models/Game";

const createGameController = {
  handleCreateGame: async (req: Request, res: Response) => {
    try {
      const game = await Game.create({
        _id: nanoid(8),
        playerWhite: null,
        playerBlack: null,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      });

      res.status(201).json({ id: game._id });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default createGameController;
