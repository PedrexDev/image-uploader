const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const User = require('../models/User');

function isOwner(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'owner') {
    return next();
  }
  res.status(403).send('Forbidden');
}

router.get('/', isOwner, async (req, res) => {
  const users = await User.find({ role: 'owner' });
  const uploads = await Upload.find().sort({ uploadedAt: -1 });

  res.render('admin', {
    user: req.user,
    users,
    uploads,
    userCount: users.length
  });
});

router.post('/add', isOwner, async (req, res) => {
  const { discordId } = req.body;

  try {
    const user = await User.findOne({ discordId });
    if (!user) return res.status(404).send('User not found');

    user.role = 'owner';
    await user.save();

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error promoting user.');
  }
});

router.post('/remove/:discordId', isOwner, async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId });
    if (user) {
      user.role = 'user';
      await user.save();
    }
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing user.');
  }
});

router.post('/delete-image/:id', isOwner, async (req, res) => {
  await Upload.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;