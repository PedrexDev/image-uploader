const express = require('express');
const session = require('express-session');
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

const ALLOWED_USER_IDS = process.env.USERS_ID.split(',').map(id => id.trim());

const isAuthenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/');
};

app.get('/', (req, res) => {
  const guilds = req.user?.guilds || [];
  res.render('index', { user: req.user, guilds });
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res, next) => {
    if (req.user.id !== process.env.OWNER_ID) {
      req.logout(() => {
        res.status(403).send('Access denied: you are not the owner.');
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
