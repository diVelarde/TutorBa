import File from "../models/File.js";
import { uploadFileToCloudinary } from "../services/cloudinaryService.js";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = await uploadFileToCloudinary(req.file);

    const newFile = await File.create({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl,
      uploader: req.user?._id || null,
    });

    res.status(200).json({ message: "File uploaded successfully", data: newFile });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const getFilesController = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};