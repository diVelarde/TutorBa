import { body, validationResult } from "express-validator";

export const studentProfileValidator = [
  body("userId").trim().notEmpty().withMessage("userId is required").bail().isMongoId().withMessage("userId must be a valid Mongo ID"),
  body("bio").optional().isString().trim().isLength({ max: 1000 }).withMessage("bio too long"),
  body("interests").optional().isArray().withMessage("interests must be an array of strings"),
  body("interests.*").optional().isString().trim().notEmpty().withMessage("each interest must be a non-empty string"),
  body("yearLevel").optional().isString().trim().withMessage("yearLevel must be a string"),
  body("profileImage").optional().isURL().withMessage("profileImage must be a valid URL"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};