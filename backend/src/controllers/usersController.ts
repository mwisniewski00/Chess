import { Response } from "express";
import User from "../models/User";
import { IGetUserAuthInfoRequest } from "../middleware/verifyJWT";
import getErrorMessage from "../helpers/getErrorMessage";
require("dotenv").config();

//test route

const usersController = {
  getUsers: async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default usersController;
