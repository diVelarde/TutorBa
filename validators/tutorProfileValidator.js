import { body, validationResult } from "express-validator";

export const tutorProfileValidator = [
  body("userId").trim().notEmpty().withMessage("userId is required").bail().isMongoId().withMessage("userId must be a valid Mongo ID"),
  body("bio").optional().isString().trim().isLength({ max: 1000 }).withMessage("bio too long"),
  body("subjectsTaught").optional().isArray().withMessage("subjectsTaught must be an array of strings"),
  body("subjectsTaught.*").optional().isString().trim().notEmpty().withMessage("each subject must be a non-empty string"),
  body("experience").optional().isString().trim(),
  body("education").optional().isString().trim(),
  body("profileImage").optional().isURL().withMessage("profileImage must be a valid URL"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("rating must be a number between 0 and 5"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};