import { Request, Response } from "express";
import { User } from "../../models/User";
require("dotenv").config();

const validationController = {
  checkUsernameAvailability: async (req: Request, res: Response) => {
    const { username } = req.query;

    if (!username)
      return res.status(400).json({ error: "No username provided" });

    const user = await User.findOne({ username: username });
    if (user) {
      res.status(409).json({ error: "Username taken" });
    } else {
      res.sendStatus(200);
    }
  },

  checkEmailAvailability: async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email) return res.status(400).json({ error: "No email provided" });

    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ error: "Email taken" });
    } else {
      res.sendStatus(200);
    }
  },
};

export default validationController;
