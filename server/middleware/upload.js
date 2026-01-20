import multer from 'multer';
import fs from 'fs';
import path from 'path';

// 1. Ensure the upload directory exists
const uploadDir = 'uploads/agreements';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Save as: timestamp-filename.pdf
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

// 3. File Filter (PDFs & Images only)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed for agreements!'), false);
  }
};

export const uploadAgreement = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});