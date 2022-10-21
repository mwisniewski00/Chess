import { Request, Response } from "express";
import User from "../models/User";
import getErrorMessage from "../helpers/getErrorMessage";
require("dotenv").config();

const validationController = {
    checkUsernameAvailability: async (req: Request, res: Response) => {
        const { username } = req.query;
      
        try {
          const user = await User.findOne({ username: username });
          if (user) {
            res.json({ usernameTaken: true });
          } else {
            res.json({ usernameTaken: false });
          }
        } catch (error) {
          console.log(getErrorMessage(error));
          res.status(500).json({ message: getErrorMessage(error) });
        }
      },

      checkEmailAvailability: async (req: Request, res: Response) => {
        const { email } = req.query;
      
        try {
          const user = await User.findOne({ email: email });
          if (user) {
            res.json({ emailTaken: true });
          } else {
            res.json({ emailTaken: false });
          }
        } catch (error) {
          console.log(getErrorMessage(error));
          res.status(500).json({ message: getErrorMessage(error) });
        }
      },
}

export default validationController;