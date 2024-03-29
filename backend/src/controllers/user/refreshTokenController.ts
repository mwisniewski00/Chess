import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../../models/User";
require("dotenv").config();

const refreshTokenController = {
  handleRefreshToken: async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (err: any, decoded: any) => {
        if (
          err ||
          !user._id.equals(decoded._id) ||
          user.username !== decoded.username
        ) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { username: decoded.username, _id: decoded._id },
          process.env.ACCESS_TOKEN_SECRET as Secret,
          { expiresIn: "15m" },
        );
        res.json({
          accessToken,
          userInfo: {
            username: user.username,
            email: user.email,
            id: user._id,
          },
        });
      },
    );
  },
};

export default refreshTokenController;
