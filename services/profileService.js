import Student from "../models/StudentProfile.js";
import TutorProfile from "../models/TutorProfile.js";

export const fetchProfile = async (id) => 
    Student.findById(id) || TutorProfile.findById(id);

export const editProfile = async (id, data) => 
    Student.findByIdAndUpdate(id, data, { new: true });