import Favorite from "../models/Favorite.js";

export const addFavorite = async (studentId, tutorId) => {
  const exists = await Favorite.findOne({ studentId, tutorId });
  if (exists) throw new Error("Already added to favorites.");
  return Favorite.create({ studentId, tutorId });
};

export const removeFavorite = async (studentId, tutorId) => {
  return Favorite.findOneAndDelete({ studentId, tutorId });
};

export const getFavorites = async (studentId) => {
  return Favorite.find({ studentId }).populate("tutorId");
};
