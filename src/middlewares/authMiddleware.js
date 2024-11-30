import jwt from "jsonwebtoken";
import { isValid } from "zod";
import User from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided", isValid: false });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log({token,decodedToken})

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", isValid: false });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        isValid: false,
      });
    }
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ message: "Authentication failed", isValid: false });
  }
};
