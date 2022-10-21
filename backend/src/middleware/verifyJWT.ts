import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface IGetUserAuthInfoRequest extends Request {
  user?: string;
}

const verifyJWT = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  console.log(authHeader);

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    (err, decoded: any) => {
      if (err) return res.sendStatus(403); //invalid token
      req.user = decoded.username;
      next();
    },
  );
  return;
};

export default verifyJWT;
