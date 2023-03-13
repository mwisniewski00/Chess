import { Application } from "express";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import corsOptions from "./config/corsOptions";
import { verifyJWT, verifyGameRoomAffiliation } from "./middleware/socketAuth";
import gameMovesController from "./controllers/game/gameMovesController";
import getSocketRoomId from "./helpers/getSocketRoomId";

export const initSocket = (server: HttpServer, app: Application) => {
  const io = new Server(server, { cors: corsOptions });

  const gameRooms = io.of(/^\/game\/\w+$/).on("connection", socket => {
    const { name } = socket.nsp;
    const gameId = getSocketRoomId(name);
    socket.on(
      "move",
      async message =>
        await gameMovesController.handleMove(io, gameId, message),
    );
  });

  const allSockets = [gameRooms];

  allSockets.forEach(channel => {
    channel.use(verifyJWT);
  });

  gameRooms.use(verifyGameRoomAffiliation);

  app.io = io;
};
