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

const isAuthenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.redirect('/');
};

app.get('/', (req, res) => res.render('index', { user: req.user }));

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);
app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.use('/upload', isAuthenticated, require('./routes/upload'));
app.use('/gallery', require('./routes/gallery'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
