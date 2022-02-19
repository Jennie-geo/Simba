import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error('Please upload an image.'));
    }
    cb(null, true);
  },
});
