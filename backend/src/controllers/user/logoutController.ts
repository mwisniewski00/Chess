import { Request, Response } from "express";
import { User } from "../../models/User";
require("dotenv").config();

const logoutController = {
  handleLogout: async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    user.refreshToken = "";
    await user.save();

    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  },
};

export default logoutController;
