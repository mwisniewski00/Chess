import { User } from "../models/User";
import dbConfig from "../config/dbConn";
import mongoose, { ConnectOptions } from "mongoose";
import { Player } from "chessrating";
import schedule from "node-schedule";

mongoose
  .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(response => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`,
    );
  })
  .catch(error => console.error("Error connecting to MongoDB", error));

const updateRatingDeviation = async () => {
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const filter = {
    lastGameTimestamp: { $lt: threeDaysAgo },
    ratingDeviation: { $lt: 350 },
  };

  try {
    const users = await User.find(filter);
    let updatedCount = 0;

    for (const user of users) {
      const player = new Player(
        user.rating,
        user.ratingDeviation,
        user.volatility,
      );
      player.executeMatches([]);
      user.ratingDeviation = player.ratingDeviation;
      user.lastGameTimestamp = Date.now();
      await user.save();
      updatedCount++;
    }

    console.log("Rating deviation updated for", updatedCount, "users");
  } catch (error) {
    console.error("Error updating rating deviation:", error);
  }
};

schedule.scheduleJob("0 0 * * *", updateRatingDeviation);
