import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Progress from "../models/Progress";

dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/devlingo";
    await mongoose.connect(mongoUri);
    console.log("Connected to DB.");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log("Running weekly aggregate query...");
    const leadersList = await User.aggregate([
      {
        $lookup: {
          from: "progresses",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$completed", true] },
                    { $gte: ["$completedAt", sevenDaysAgo] }
                  ]
                }
              }
            }
          ],
          as: "recentProgress"
        }
      },
      {
        $addFields: {
          weeklyXP: { $sum: "$recentProgress.xpEarned" }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          streak: 1,
          allTimeXP: "$xp",
          xp: "$weeklyXP",
        }
      },
      {
        $sort: { xp: -1, allTimeXP: -1, username: 1 }
      }
    ]);

    console.log("Weekly leaders list:", leadersList);

    const allTime = await User.find()
      .sort({ xp: -1, username: 1 })
      .select("_id username xp streak")
      .lean();
    console.log("All time leaders list:", allTime);

    process.exit(0);
  } catch (err) {
    console.error("Error running test:", err);
    process.exit(1);
  }
};

run();
