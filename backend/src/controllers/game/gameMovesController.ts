import { Response, Request } from "express";
import { Game } from "chess-easy";
import GameModel from "../../models/Game";
import { io } from "../../app";
import { HydratedDocument } from "mongoose";
import { IGame } from "../../models/Game";
import User from "../../models/User";
import getGlickoRating, { Score } from "../../helpers/getGlickoRating";
import getErrorMessage from "../../helpers/getErrorMessage";

const capitalizeFirstLetter = (word: String) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const getWinnerUsername = (game: Game, gameModel: HydratedDocument<IGame>) => {
  const loserColor = game.getNextColor();
  return loserColor === "white"
    ? gameModel.playerBlack?.username
    : gameModel.playerWhite?.username;
};

const handleGameEnd = async (
  gameModel: HydratedDocument<IGame>,
  game: Game,
  score: Score,
) => {
  const player1Username = getWinnerUsername(game, gameModel);

  const player2Username =
    game.getNextColor() === "white"
      ? gameModel.playerWhite?.username
      : gameModel.playerBlack?.username;

  const player1 = await User.findOne({ username: player1Username });
  const player2 = await User.findOne({ username: player2Username });

  if (!player1 || !player2) {
    throw new Error("User not found");
  }

  const { player1Rating, player2Rating } = getGlickoRating(
    { rating: player1.rating, rd: 300, vol: 0.06 },
    { rating: player2.rating, rd: 300, vol: 0.06 },
    score,
  );

  const player1RatingDiff = player1Rating - player1.rating;
  const player2RatingDiff = player2Rating - player2.rating;

  player1.rating = player1Rating as number;
  player2.rating = player2Rating as number;

  await player1.save();
  await player2.save();

  io.emit(`game_end${gameModel._id}`, {
    player1: {
      username: player1.username,
      ratingDiff: player1RatingDiff,
      status: score === 1 ? "win" : "draw",
    },
    player2: {
      username: player2.username,
      ratingDiff: player2RatingDiff,
      status: score === 1 ? "loss" : "draw",
    },
  });
};

const handleGameStateMessage = async (
  gameModel: HydratedDocument<IGame>,
  game: Game,
) => {
  let message = "";
  if (game.isCheckmate) {
    await handleGameEnd(gameModel, game, 1);
    message = `Game over! ${getWinnerUsername(game, gameModel)} won!`;
  } else if (game.isCheck) {
    message = capitalizeFirstLetter(game.getNextColor()) + " in check!";
  } else if (game.isDraw().isDraw) {
    await handleGameEnd(gameModel, game, 0.5);
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
    try {
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
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default gameMovesController;
