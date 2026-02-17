const { body, validationResult } = require("express-validator");

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Register validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),
  validate
];

// Login validation rules
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  validate
];

// Profile update validation
const profileValidation = [
  body("profile.body_type")
    .optional()
    .isIn(["hourglass", "pear", "apple", "rectangle", "inverted_triangle", ""])
    .withMessage("Invalid body type"),
  body("profile.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number"),
  body("profile.weight")
    .optional()
    .isNumeric()
    .withMessage("Weight must be a number"),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  validate
};