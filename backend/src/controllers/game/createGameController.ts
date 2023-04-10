import { Response, Request } from "express";
import { nanoid } from "nanoid";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game, { GameType } from "../../models/Game";

const createGameController = {
  handleCreateGame: async (_: Request, res: Response) => {
    try {
      const game = await Game.create({
        _id: nanoid(8),
        playerWhite: null,
        playerBlack: null,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        type: GameType.WITH_TIMER,
      });

      res.status(201).json({ id: game._id });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log(errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  },
};

export default createGameController;
