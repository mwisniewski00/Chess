import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import Game from "../../models/Game";
import { User } from "../../models/User";
import ExpressError from "../../helpers/ExpressError";

const joinGameController = {
  handleJoinGame: async (req: IGetUserAuthInfoRequest, res: Response) => {
    const gameId = req.params.id;
    const player = req.user;
    const io = req.app.io.of(`/game/${gameId}`);

    const game = await Game.findById(gameId)
      .populate({
        path: "playerWhite",
        select: "-password -refreshToken",
      })
      .populate({
        path: "playerBlack",
        select: "-password -refreshToken",
      });

    if (!game) {
      throw new ExpressError("Game not found", 404);
    }

    // player rejoins game
    if (
      game?.playerWhite?._id?.equals(player?._id) ||
      game?.playerBlack?._id?.equals(player?._id)
    ) {
      return res.status(200).json({ game });
    }

    // game is full
    if (game.playerWhite && game.playerBlack) {
      throw new ExpressError("Game is full", 400);
    }

    // black player joins for the first time
    const user = await User.findById(player?._id).select(
      "-password -refreshToken",
    );
    const playerData = {
      username: user?.username,
      rating: user?.rating,
    };
    if (game.playerWhite && !game.playerBlack) {
      game.playerBlack = user;
      const newMessage = {
        message: `${player?.username} joined as Black!`,
        author: null,
      };
      game.chat.push(newMessage);
      game.whiteTimer.running = Date.now();
      await Game.findByIdAndUpdate(gameId, game);
      io.emit(`player_connected`, {
        playerBlack: playerData,
        timers: { white: game.whiteTimer, black: game.blackTimer },
      });
      io.emit(`new_message`, newMessage);
    }

    // white player joins for the first time
    if (!game.playerWhite) {
      game.playerWhite = user;
      const newMessage = {
        message: `${player?.username} joined as White!`,
        author: null,
      };
      game.chat.push(newMessage);
      await Game.findByIdAndUpdate(gameId, game);
      io.emit("player_connected", { playerWhite: playerData });
      io.emit(`new_message`, newMessage);
    }

    res.status(200).json({ game });
  },
};

export default joinGameController;
