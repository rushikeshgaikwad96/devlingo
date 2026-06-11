import { Router } from "express";
import {
  getUserProgress,
  getLeaderboard,
  loseHeart,
  restoreHearts,
  getUserStats,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/progress", protect, getUserProgress);
router.get("/leaderboard", protect, getLeaderboard);
router.post("/lose-heart", protect, loseHeart);
router.post("/restore-hearts", protect, restoreHearts);
router.get("/stats", protect, getUserStats);
router.put("/update", protect, updateProfile);

export default router;
