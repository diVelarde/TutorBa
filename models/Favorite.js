import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile", required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Favorite", FavoriteSchema);