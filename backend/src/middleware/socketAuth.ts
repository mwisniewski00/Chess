import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import getSocketRoomId from "../helpers/getSocketRoomId";
import GameModel from "../models/Game";
import getErrorMessage from "../helpers/getErrorMessage";

const onAuthError = () => new Error("unauthorized");

const verifyJWT = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
  const authHeader = socket.handshake.headers.authorization;
  if (!authHeader) return next(onAuthError());

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    (err: any, decoded: any) => {
      if (err) next(onAuthError());
      socket.data = { user: { ...decoded } };
      next();
    },
  );
};

const verifyGameRoomAffiliation = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
  const { user } = socket.data;
  const gameId = getSocketRoomId(socket.nsp.name);
  try {
    const gameModel = await GameModel.findById(gameId);
    if (!gameModel) {
      return next(onAuthError());
    }
    if (
      !gameModel?.playerBlack?.equals(user._id) &&
      !gameModel?.playerWhite?.equals(user._id)
    ) {
      return next(onAuthError());
    }
    next();
  } catch (error) {
    console.log(getErrorMessage(error));
    next(onAuthError());
  }
};

export { verifyJWT, verifyGameRoomAffiliation };
