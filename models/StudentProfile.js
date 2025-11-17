import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String },
  interests: [{ type: String }],
  yearLevel: { type: String },
  profileImage: { type: String },
});

export default mongoose.model("StudentProfile", StudentProfileSchema);