import { Response, Request } from "express";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game, { IMessage } from "../../models/Game";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import { io } from "../../app";

const chatController = {
  handleNewMessage: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const gameId = req.params.id;
    const author = req.user;
    const { message } = req.body;

    try {
      io.emit(`new_message${gameId}`, { message, author });

      const game = await Game.findById(gameId).lean();

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      game.chat.push({ message, author } as IMessage);

      await Game.findByIdAndUpdate(gameId, game);

      return res.status(200).send();
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default chatController;
