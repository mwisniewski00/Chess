import { Game } from "chess-easy";
import GameModel, { GameType, Timer } from "../../models/Game";
import { HydratedDocument } from "mongoose";
import { IGame } from "../../models/Game";
import { User } from "../../models/User";
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
    ? gameModel.playerBlack.username
    : gameModel.playerWhite.username;
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
    {
      rating: player1.rating,
      rd: player1.ratingDeviation,
      vol: player1.volatility,
    },
    {
      rating: player2.rating,
      rd: player2.ratingDeviation,
      vol: player2.volatility,
    },
    score,
  );

  const player1RatingDiff =
    Math.floor(player1Rating.getRating()) - Math.floor(player1.rating);
  const player2RatingDiff =
    Math.floor(player2Rating.getRating()) - Math.floor(player2.rating);

  player1.rating = player1Rating.getRating();
  player1.ratingDeviation = player1Rating.getRd();
  player1.volatility = player1Rating.getVol();
  player2.rating = player2Rating.getRating();
  player2.ratingDeviation = player2Rating.getRd();
  player2.volatility = player2Rating.getVol();

  await player1.save();
  await player2.save();

  gameModel.isFinished = true;

  await gameModel.save();

  io.emit(`game_end`, {
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

const sendMessage = async (
  gameModel: HydratedDocument<IGame>,
  io: Namespace,
  message: string,
) => {
  const newMessage = { message, author: null };
  gameModel.chat.push(newMessage);
  await gameModel.save();
  io.emit(`new_message`, newMessage);
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
    sendMessage(gameModel, io, message);
  }
};

const getTimers = (playerId: string, game: HydratedDocument<IGame>) =>
  game.playerWhite._id.equals(playerId)
    ? [game.whiteTimer, game.blackTimer]
    : [game.blackTimer, game.whiteTimer];

const updateTimers = (currentPlayerTimer: Timer, opponentTimer: Timer) => {
  const now = Date.now();
  if (currentPlayerTimer.running) {
    const passedTime = now - currentPlayerTimer.running;
    currentPlayerTimer.timeLeft = currentPlayerTimer.timeLeft - passedTime;
    if (currentPlayerTimer.timeLeft <= 0) {
      return true;
    }
  }
  delete currentPlayerTimer.running;
  opponentTimer.running = now;
  return false;
};

const handleGameMove = async (
  gameModel: HydratedDocument<IGame>,
  game: Game,
  io: Namespace,
  message: GameMoveMessage,
) => {
  const { from, to, promotion } = message;
  if (game.move(from, to, promotion)) {
    gameModel.fen = game.generateFen();
    await gameModel.save();
    io.emit(`move`, {
      from,
      to,
      promotion,
      timers: {
        white: gameModel.whiteTimer,
        black: gameModel.blackTimer,
      },
    });
    await handleGameStateMessage(gameModel, game, io);
  }
};

const handleGameWithTimer = async (
  userId: string,
  gameModel: HydratedDocument<IGame>,
  game: Game,
  io: Namespace,
  message?: GameMoveMessage,
) => {
  const [currentPlayerTimer, opponentTimer] = getTimers(userId, gameModel);
  const isGameOver = updateTimers(currentPlayerTimer, opponentTimer);
  gameModel.markModified("whiteTimer");
  gameModel.markModified("blackTimer");
  if (isGameOver) {
    handleGameEnd(gameModel, game, 1, io);
    sendMessage(
      gameModel,
      io,
      `Game over due to time end! ${getWinnerUsername(game, gameModel)} won!`,
    );
  } else if (message) {
    await handleGameMove(gameModel, game, io, message);
  }
};

const gameMovesController = {
  handleMove: async (
    io: Server,
    gameId: String,
    userId: string,
    message?: GameMoveMessage,
  ) => {
    try {
      const gameModel = await GameModel.findById(gameId)
        .populate("playerWhite")
        .populate("playerBlack");
      const socket = io.of(`/game/${gameId}`);
      if (!gameModel) {
        return;
      }
      const game = new Game(gameModel.fen);
      if (gameModel.type === GameType.WITH_TIMER) {
        await handleGameWithTimer(userId, gameModel, game, socket, message);
      } else if (message) {
        await handleGameMove(gameModel, game, socket, message);
      }
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  },
};

export default gameMovesController;
