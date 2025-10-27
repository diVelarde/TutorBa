import Tutor from "../models/Tutor.js";

export const findTutors = async (filters) => {
  const { subject, department, keyword } = filters;
  const query = {};

  if (subject) query.subject = { $regex: subject, $options: "i" };
  if (department) query.department = { $regex: department, $options: "i" };
  if (keyword) query.name = { $regex: keyword, $options: "i" };

  return Tutor.find(query);
};
