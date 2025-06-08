const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const ALLOWED_USER_ID = '813812775968833586';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  if (req.user.id !== ALLOWED_USER_ID) return res.status(403).send('Forbidden');
  res.render('upload', { user: req.user });
});

router.post('/', upload.single('image'), (req, res) => {
  if (req.user.id !== ALLOWED_USER_ID) return res.status(403).send('Forbidden');
  res.redirect('/gallery');
});

module.exports = router;