import express from "express";
import { addFav, removeFav, listFavs } from "../controllers/favoriteController.js";
import {
  validateAddFavorite,
  validateRemoveFavorite,
  validateListFavorites,
} from "../validators/favoriteValidators.js";

const router = express.Router();

router.post("/", validateAddFavorite, addFav);
router.delete("/", validateRemoveFavorite, removeFav);
router.get("/:studentId", validateListFavorites, listFavs);

export default router;
