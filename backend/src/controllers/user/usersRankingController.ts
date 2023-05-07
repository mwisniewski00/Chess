import { User } from "../../models/User";
import { Response, Request } from "express";
import { RequestWithVerifiedUser } from "../../types";

const usersRankingController = {
  getRankingData: async (req: Request, res: Response) => {
    const reqWithUser = req as RequestWithVerifiedUser;
    const topUsers = await User.find({ ratingDeviation: { $lte: 100 } })
      .sort({ rating: -1 })
      .limit(50)
      .select("username rating avatarUrl");
    const user = await User.findById(reqWithUser.user._id);
    if (!user) {
      throw Error("Logged in user not found");
    }
    const usersWithHigherRating =
      user.ratingDeviation <= 100
        ? await User.countDocuments({
            rating: { $lt: user?.rating },
            ratingDeviation: { $lte: 100 },
          })
        : null;
    const position =
      usersWithHigherRating !== null ? usersWithHigherRating + 1 : null;
    res.send({
      users: topUsers,
      currentUser: {
        position,
        avatarUrl: user.avatarUrl,
        username: user.username,
      },
    });
  },
};

export default usersRankingController;
