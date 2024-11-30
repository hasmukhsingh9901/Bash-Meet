import express from "express";
import { refreshAccessToken, signIn, signUp } from "../controllers/authController.js";
import { signUpLimiter, loginLimiter } from "../utils/rateLimiter.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUpLimiter, signUp);
router.post("/signin", loginLimiter, signIn);
router.post("/refresh-token", refreshAccessToken);

router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.id}, you are authenticated!` });
});

export default router;