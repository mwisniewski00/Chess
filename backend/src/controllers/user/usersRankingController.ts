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
    const usersWithHigherRating = await User.countDocuments({
      rating: { $lt: user?.rating },
    });
    res.send({
      users: topUsers,
      currentUser: {
        position: usersWithHigherRating + 1,
        avatarUrl: user.avatarUrl,
        username: user.username,
      },
    });
  },
};

export default usersRankingController;
