import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { ensureProfileOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getProfile);
router.put("/:id", ensureProfileOwnership, updateProfile);

export default router;
