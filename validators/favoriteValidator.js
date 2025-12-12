import { body, param } from "express-validator";

export const validateAddFavorite = [
  body("studentId")
    .notEmpty().withMessage("studentId is required")
    .isMongoId().withMessage("Invalid studentId format"),

  body("tutorId")
    .notEmpty().withMessage("tutorId is required")
    .isMongoId().withMessage("Invalid tutorId format"),
];

export const validateRemoveFavorite = [
  body("studentId")
    .notEmpty().withMessage("studentId is required")
    .isMongoId().withMessage("Invalid studentId format"),

  body("tutorId")
    .notEmpty().withMessage("tutorId is required")
    .isMongoId().withMessage("Invalid tutorId format"),
];

export const validateListFavorites = [
  param("studentId")
    .notEmpty().withMessage("studentId is required")
    .isMongoId().withMessage("Invalid studentId format"),
];
