import { Router } from "express";
import { getUserProgress, getLeaderboard } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/progress", protect, getUserProgress);
router.get("/leaderboard", protect, getLeaderboard);

export default router;