import { Router } from "express";
import { register, login, getMe } from "../controllers/authcontrollers";
import {
  getLessons,
  getLessonById,
  completeLesson,
} from "../controllers/lessonController";
import { protect, optionalProtect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:language", optionalProtect, getLessons);
router.get("/single/:id", optionalProtect, getLessonById);
router.post("/complete", protect, completeLesson);
router.get("/me", protect, getMe);
export default router;