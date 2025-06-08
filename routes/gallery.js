const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const uploads = await Upload.find({ uploaderId: req.user.id }).sort({ uploadedAt: -1 });
    res.render('gallery', { user: req.user, uploads });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
