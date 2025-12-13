const mongoose = require('mongoose');

function isValidObjectId(id) {
  try {
    return mongoose.Types.ObjectId.isValid(String(id));
  } catch (e) {
    return false;
  }
}

// Middleware to ensure required body fields exist
function requireBodyFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
    if (missing.length) {
      return res.status(400).json({ message: 'Missing required fields', missing });
    }
    next();
  };
}

// Middleware to validate ObjectId fields in body
function validateBodyObjectIds(fields) {
  return (req, res, next) => {
    const invalid = fields.filter(f => !isValidObjectId(req.body[f]));
    if (invalid.length) {
      return res.status(400).json({ message: 'Invalid ObjectId in body', invalid });
    }
    next();
  };
}

// Middleware to validate an ObjectId param (e.g., :favoriteId)
function validateParamObjectId(paramName) {
  return (req, res, next) => {
    const val = req.params[paramName];
    if (!isValidObjectId(val)) {
      return res.status(400).json({ message: 'Invalid ObjectId in params', param: paramName });
    }
    next();
  };
}

module.exports = {
  isValidObjectId,
  requireBodyFields,
  validateBodyObjectIds,
  validateParamObjectId
};
