import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String },
  fileUrl: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);