const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('./models/User');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.discordId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ discordId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const ownerId = process.env.OWNER_ID;

    const existingUser = await User.findOne({ discordId: profile.id });

    if (existingUser) {
      existingUser.username = profile.username;
      existingUser.displayName = profile.global_name;
      existingUser.avatar = profile.avatar;
      existingUser.email = profile.email;
      await existingUser.save();
      return done(null, existingUser);
    }

    const newUser = new User({
      discordId: profile.id,
      username: profile.username,
      displayName: profile.global_name,
      avatar: profile.avatar,
      email: profile.email,
      role: ownerId.includes(profile.id) ? 'owner' : 'user'
    });

    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
}));