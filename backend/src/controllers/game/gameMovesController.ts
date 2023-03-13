import { Response, Request } from "express";
import { Game } from "chess-easy";
import GameModel from "../../models/Game";
import { HydratedDocument } from "mongoose";
import { IGame } from "../../models/Game";
import User from "../../models/User";
import getGlickoRating, { Score } from "../../helpers/getGlickoRating";
import getErrorMessage from "../../helpers/getErrorMessage";
import { Namespace, Server } from "socket.io";

interface GameMoveMessage {
  from: string;
  to: string;
  promotion: string;
}

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
  io: Namespace,
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
  io: Namespace,
) => {
  let message = "";
  if (game.isCheckmate) {
    await handleGameEnd(gameModel, game, 1, io);
    message = `Game over! ${getWinnerUsername(game, gameModel)} won!`;
  } else if (game.isCheck) {
    message = capitalizeFirstLetter(game.getNextColor()) + " in check!";
  } else if (game.isDraw().isDraw) {
    await handleGameEnd(gameModel, game, 0.5, io);
    message = `Draw! ${game.isDraw().reason}`;
  }
  if (message) {
    const newMessage = { message, author: null };
    gameModel.chat.push(newMessage);
    await gameModel.save();
    io.emit(`new_message`, newMessage);
  }
};

const gameMovesController = {
  handleMove: async (io: Server, gameId: String, message: GameMoveMessage) => {
    try {
      const gameModel = await GameModel.findById(gameId);
      if (!gameModel) {
        return;
      }
      const { from, to, promotion } = message;
      const game = new Game(gameModel.fen);
      if (game.move(from, to, promotion)) {
        gameModel.fen = game.generateFen();
        await gameModel.save();
        const socket = io.of(`/game/${gameId}`);
        socket.emit(`game/${gameId}/move`, { from, to, promotion });
        await handleGameStateMessage(gameModel, game, socket);
      }
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  },
};

export default gameMovesController;
