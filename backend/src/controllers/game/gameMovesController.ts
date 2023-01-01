import { Response, Request } from "express";
import { Game } from "chess-easy";
import GameModel from "../../models/Game";
import { io } from "../../app";
import { HydratedDocument } from "mongoose";
import { IGame } from "../../models/Game";

const capitalizeFirstLetter = (word: String) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const getWinnerUsername = (game: Game, gameModel: HydratedDocument<IGame>) => {
  const loserColor = game.getNextColor();
  return loserColor === "white"
    ? gameModel.playerBlack?.username
    : gameModel.playerWhite?.username;
};

const handleGameStateMessage = async (
  gameModel: HydratedDocument<IGame>,
  game: Game,
) => {
  let message = "";
  if (game.isCheckmate) {
    message = `Game over! ${getWinnerUsername(game, gameModel)} won!`;
  } else if (game.isCheck) {
    message = capitalizeFirstLetter(game.getNextColor()) + " in check!";
  } else if (game.isDraw().isDraw) {
    message = `Draw! ${game.isDraw().reason}`;
  }
  if (message) {
    const newMessage = { message, author: null };
    gameModel.chat.push(newMessage);
    await gameModel.save();
    io.emit(`new_message${gameModel._id}`, newMessage);
  }
};

const gameMovesController = {
  handleMove: async (req: Request, res: Response) => {
    const gameId = req.params.id;
    const gameModel = await GameModel.findById(gameId);
    if (!gameModel) {
      return res.status(400).send("Game not found");
    }
    const { from, to, promotion } = req.body;
    const game = new Game(gameModel.fen);
    if (game.move(from, to, promotion)) {
      gameModel.fen = game.generateFen();
      await gameModel.save();
      io.emit(`game/${gameId}/move`, { from, to, promotion });
      await handleGameStateMessage(gameModel, game);
      return res.sendStatus(200);
    }
    res.sendStatus(400);
  },
};

export default gameMovesController;
