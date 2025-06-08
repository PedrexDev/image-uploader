const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./auth');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const ALLOWED_USER_ID = process.env.OWNER_ID;

const isAuthenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/');
};

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  const guilds = req.user?.guilds || [];
  res.render('index', {
    user: req.user,
    guilds,
    allowedIds: ALLOWED_USER_ID
  });
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    if (!ALLOWED_USER_ID.includes(req.user.id)) {
      req.logout(() => {
        res.status(403).render('not-allowed');
      });
    } else {
      res.redirect('/');
    }
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.use('/upload', isAuthenticated, require('./routes/upload'));
app.use('/gallery', require('./routes/gallery'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
