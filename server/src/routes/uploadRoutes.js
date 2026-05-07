import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  cb(isValid ? null : new Error('Only image files are allowed'), isValid);
};

const upload = multer({ storage, fileFilter });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  res.status(201).json({ image: `/uploads/${req.file.filename}` });
});

export default router;
