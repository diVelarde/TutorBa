import mongoose from "mongoose";

const TutorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String },
  subjectsTaught: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  profileImage: { type: String },
  rating: { type: Number, default: 0 },
});

export default mongoose.model("TutorProfile", TutorProfileSchema);