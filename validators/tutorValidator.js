import { body, validationResult } from "express-validator";

export const tutorValidator = [
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};