import express from "express";
import { refreshAccessToken, signIn, signUp, verifyToken } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginLimiter, signUpLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

router.post("/signup", signUpLimiter, signUp);
router.post("/signin", loginLimiter, signIn);
router.post("/refresh-token", refreshAccessToken);

router.get("/verify-token",authMiddleware,verifyToken)

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.id}, you are authenticated!` });
});

export default router;