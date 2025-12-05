require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${port}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // Minimal profile object to pass to the frontend
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
      };
      return done(null, user);
    }
  )
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start Google OAuth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/?auth=failed` }),
  (req, res) => {
    // Successful authentication. Redirect to frontend with user info in query string (URL-encoded JSON).
    const user = req.user || {};
    const safe = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${FRONTEND_URL}/?user=${safe}`);
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout?.();
  req.session?.destroy?.(() => {});
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});