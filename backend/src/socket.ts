import { Application } from "express";
import { Server as HttpsServer } from "https";
import { Server } from "socket.io";
import corsOptions from "./config/corsOptions";
import { verifyJWT, verifyGameRoomAffiliation } from "./middleware/socketAuth";
import gameMovesController from "./controllers/game/gameMovesController";
import getSocketRoomId from "./helpers/getSocketRoomId";

export const initSocket = (server: HttpsServer, app: Application) => {
  const io = new Server(server, { cors: corsOptions });

  const gameRooms = io.of(/^\/game\/\w+$/).on("connection", socket => {
    const { name } = socket.nsp;
    const { _id: userId } = socket.data.user;
    const gameId = getSocketRoomId(name);
    socket.on(
      "move",
      async message =>
        await gameMovesController.handleMove(io, gameId, userId, message),
    );
    socket.on(
      "timer_end",
      async () => await gameMovesController.handleMove(io, gameId, userId),
    );
  });

  const allSockets = [gameRooms];

  allSockets.forEach(channel => {
    channel.use(verifyJWT);
  });

  gameRooms.use(verifyGameRoomAffiliation);

  app.io = io;
};
