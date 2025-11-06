import express from "express";
import { getTutors } from "../controllers/tutorController.js";
import { tutorValidator, validate } from "../validators/tutorValidator.js";

const router = express.Router();

router.get("/", tutorValidator, validate, tutorControl.getTutors);

export default router;