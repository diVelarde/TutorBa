import express from "express";
import multer from "multer";
import { uploadFileController, getFilesController } from "../controllers/uploadController.js";
import { validateFile } from "../middleware/validateFileUpload.js"; // optional

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), validateFile, uploadFileController);
router.get("/", getFilesController);

export default router;