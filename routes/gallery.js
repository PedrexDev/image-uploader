const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const dir = path.join(__dirname, '../public/uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.send('Error reading upload directory.');
    res.render('gallery', { files, user: req.user });
  });
});

module.exports = router;