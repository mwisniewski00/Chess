import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedUser } from "../types";

export interface IGetUserAuthInfoRequest extends Request {
  user?: DecodedUser;
}

const verifyJWT = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    (err, decoded: any) => {
      if (err) return res.sendStatus(403); //invalid token
      req.user = decoded;
      next();
    },
  );
  return;
};

export default verifyJWT;
