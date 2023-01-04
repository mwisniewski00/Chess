import { Response, Request } from "express";
import { io } from "../../app";
import getErrorMessage from "../../helpers/getErrorMessage";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import Game from "../../models/Game";
import User from "../../models/User";

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
        const playerBlack = await User.findOne({
          username: player as string,
        }).lean();

        if (!playerBlack) {
          return res.status(404).json({ error: "Player not found" });
        }

        game.playerBlack = {
          username: player as string,
          rating: playerBlack.rating,
        };
        game.chat.push({
          message: `${game.playerBlack.username} joined as Black!`,
          author: null,
        });
        await Game.findByIdAndUpdate(gameId, game);
        io.emit(`player_connected${gameId}`, { playerBlack: game.playerBlack });
        io.emit(`new_message${gameId}`, {
          message: `${game.playerBlack.username} joined as Black!`,
          author: null,
        });
      }

      // white player joins for the first time
      if (!game.playerWhite) {
        const playerWhite = await User.findOne({
          username: player as string,
        }).lean();

        if (!playerWhite) {
          return res.status(404).json({ error: "Player not found" });
        }

        game.playerWhite = {
          username: player as string,
          rating: playerWhite.rating,
        };
        game.chat.push({
          message: `${game.playerWhite.username} joined as White!`,
          author: null,
        });
        await Game.findByIdAndUpdate(gameId, game);
        io.emit(`player_connected${gameId}`, { playerWhite: game.playerWhite });
        io.emit(`new_message${gameId}`, {
          message: `${game.playerWhite.username} joined as White!`,
          author: null,
        });
      }

      res.status(200).json({ game });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default joinGameController;
