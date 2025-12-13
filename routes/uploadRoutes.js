import express from "express";
import multer from "multer";
import { uploadFileController, getFilesController } from "../controllers/uploadController.js";
import { validateFileUpload } from "../validators/fileValidator.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), validateFileUpload, uploadFileController);
router.get("/", getFilesController);

export default router;