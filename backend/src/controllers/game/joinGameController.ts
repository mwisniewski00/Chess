import { Response, Request } from "express";
import { io } from "../../app";
import getErrorMessage from "../../helpers/getErrorMessage";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import Game from "../../models/Game";

const joinGameController = {
  handleJoinGame: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const gameId = req.params.id;
    const player = req.user;

    try {
      const game = await Game.findById(gameId).lean();

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      // player rejoins game
      if (
        game.playerWhite?.username === player ||
        game.playerBlack?.username === player
      ) {
        return res.status(200).json({ game });
      }

      // game is full
      if (game.playerWhite && game.playerBlack) {
        return res.status(400).json({ error: "Game is full" });
      }

      // black player joins for the first time
      if (game.playerWhite && !game.playerBlack) {
        game.playerBlack = { username: player as string };
        io.emit(`player_connected${gameId}`, { playerBlack: game.playerBlack });
      }

      // white player joins for the first time
      if (!game.playerWhite) {
        game.playerWhite = { username: player as string };
        io.emit(`player_connected${gameId}`, { playerWhite: game.playerWhite });
      }

      await Game.findByIdAndUpdate(gameId, game);

      res.status(200).json({ game });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default joinGameController;
