import { Response } from "express";
import Game, { IMessage } from "../../models/Game";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import ExpressError from "../../helpers/ExpressError";

const chatController = {
  handleNewMessage: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const gameId = req.params.id;
    const author = req.user?.username;
    const { message } = req.body;

    req.app.io.of(`/game/${gameId}`).emit(`new_message`, { message, author });

    const game = await Game.findById(gameId).lean();

    if (!game) {
      throw new ExpressError("Game not found", 404);
    }

    game.chat.push({ message, author } as IMessage);

    await Game.findByIdAndUpdate(gameId, game);

    return res.status(200).send();
  },
};

export default chatController;
