import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../../models/User";
import getErrorMessage from "../../helpers/getErrorMessage";
require("dotenv").config();

const refreshTokenController = {
  handleRefreshToken: async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
      const user = await User.findOne({ refreshToken });
      if (!user) return res.sendStatus(403);
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret,
        (err: any, decoded: any) => {
          if (err || user.username !== decoded.username) {
            return res.sendStatus(403);
          }
          const accessToken = jwt.sign(
            { username: decoded.username },
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
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default refreshTokenController;
