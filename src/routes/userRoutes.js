import express from "express";
import { addBash, fetchBash } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-bash", authenticate, addBash);
router.get("/fetch-bash",  fetchBash);

export default router;
