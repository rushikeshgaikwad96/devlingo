import { Router } from "express";
import { register, login, getMe } from "../controllers/authcontrollers";
import {
  getLessons,
  getLessonById,
  completeLesson,
} from "../controllers/lessonController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:language", protect, getLessons);
router.get("/single/:id", protect, getLessonById);
router.post("/complete", protect, completeLesson);
router.get("/me", protect, getMe);
export default router;