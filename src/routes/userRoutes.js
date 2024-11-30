import express from "express";
import { addBash, fetchBash } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-bash", authMiddleware, addBash);
router.get("/fetch-bash",  fetchBash);

export default router;
