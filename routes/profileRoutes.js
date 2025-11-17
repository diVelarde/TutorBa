import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { ensureProfileOwnership } from "../middleware/authMiddleware.js";
import { studentProfileValidator, validate as validateStudent } from "../validators/studentProfileValidator.js";
import { tutorProfileValidator, validate as validateTutor } from "../validators/tutorProfileValidator.js";

const router = express.Router();

router.get("/student/:id", getProfile);
router.put("/student/:id", ensureProfileOwnership, studentProfileValidator, validateStudent, updateProfile);

router.get("/tutor/:id", getProfile);
router.put("/tutor/:id", ensureProfileOwnership, tutorProfileValidator, validateTutor, updateProfile);

router.get("/:id", getProfile);
router.put("/:id", ensureProfileOwnership, updateProfile);

export default router;
