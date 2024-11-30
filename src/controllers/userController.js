import Bash from "../models/bashModel.js";
import User from "../models/userModel.js";

const addBash = async (req, res) => {
  try {
    const { userId, image, message } = req.body;
    const bash = await Bash.create({ userId, image, message });
    res.status(200).json({ bash });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid input data" });
    }
    res.status(500).json({ message: error.message });
  }
};

const fetchBash = async (req, res) => {
  try {
    const bash = await Bash.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          message: 1,
          userDetails: {
            name: 1,
            email: 1,
          },
        },
      },
    ]);
    res.status(200).json({ bash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addBash, fetchBash };
