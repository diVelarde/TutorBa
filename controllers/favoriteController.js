import { addFavorite, removeFavorite, getFavorites } from "../services/favoriteService.js";

export const addFav = async (req, res) => {
  try {
    const { studentId, tutorId } = req.body;
    const favorite = await addFavorite(studentId, tutorId);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFav = async (req, res) => {
  try {
    const { studentId, tutorId } = req.body;
    await removeFavorite(studentId, tutorId);
    res.json({ message: "Removed from favorites." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listFavs = async (req, res) => {
  try {
    const favorites = await getFavorites(req.params.studentId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
