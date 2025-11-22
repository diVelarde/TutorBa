export const validateFileUpload = (req, res, next) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
  const maxSize = 10 * 1024 * 1024; 

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  if (!allowedTypes.includes(req.file.mimetype))
    return res.status(400).json({ message: "Invalid file type" });

  if (req.file.size > maxSize)
    return res.status(400).json({ message: "File too large (max 10MB)" });

  next();
};