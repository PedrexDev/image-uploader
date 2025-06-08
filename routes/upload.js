const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  const uploads = await Upload.find({ 'uploader.discordId': req.user.discordId }).sort({ uploadedAt: -1 });
  res.render('upload', { user: req.user, uploads });
});

router.post('/', upload.single('image'), async (req, res) => {
  const upload = new Upload({
    title: req.body.title || 'Untitled',
    description: req.body.description || '',
    filename: req.file.filename,
    uploader: {
      discordId: req.user.discordId,
      username: req.user.username,
      displayName: req.user.displayName || req.user.username
    }
  });
  await upload.save();
  res.redirect('/upload');
});

router.post('/delete/:id', async (req, res) => {
  const upload = await Upload.findById(req.params.id);
  if (upload.uploader.discordId !== req.user.discordId && req.user.role !== 'owner') return res.sendStatus(403);
  fs.unlinkSync(path.join(__dirname, '../public/uploads', upload.filename));
  await upload.deleteOne();
  res.redirect('/upload');
});

router.post('/edit/:id', async (req, res) => {
  const upload = await Upload.findById(req.params.id);
  if (upload.uploader.discordId !== req.user.discordId && req.user.role !== 'owner') return res.sendStatus(403);
  upload.title = req.body.title;
  upload.description = req.body.description;
  await upload.save();
  res.redirect('/upload');
});

module.exports = router;