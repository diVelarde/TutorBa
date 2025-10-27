import { findTutors } from "../services/tutorService.js";

export const getTutors = async (req, res) => {
  try {
    const tutors = await findTutors(req.query);
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
