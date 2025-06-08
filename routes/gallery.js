const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const uploads = await Upload.find({ 'uploader.discordId': req.user.discordId }).sort({ uploadedAt: -1 });
    res.render('gallery', { user: req.user, uploads });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload || upload.uploader.discordId !== req.user.discordId) {
      return res.status(403).send('Not allowed');
    }

    res.render('edit', { user: req.user, upload });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;

  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload || upload.uploader.discordId !== req.user.discordId) {
      return res.status(403).send('Not allowed');
    }

    upload.title = title || 'Untitled';
    upload.description = description || '';
    await upload.save();

    res.redirect('/gallery');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload || upload.uploader.discordId !== req.user.discordId) {
      return res.status(403).send('Not allowed');
    }

    await upload.deleteOne();
    res.redirect('/gallery');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;