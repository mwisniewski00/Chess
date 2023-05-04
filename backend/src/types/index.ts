import { Request } from "express";

export interface DecodedUser {
  _id: string;
  username: string;
  iat: number;
  exp: number;
}

export interface RequestWithVerifiedUser extends Request {
  user: DecodedUser;
}
