import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  rating: { type: Number, default: 0 },
  profileImage: { type: String },
  availability: [{ day: String, startTime: String, endTime: String }],
});

export default mongoose.model("Tutor", TutorSchema);
