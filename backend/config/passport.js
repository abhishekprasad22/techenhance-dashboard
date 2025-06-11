import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pool from './database.js';
import dotenv from 'dotenv';

dotenv.config();

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
    if (result.rows.length > 0) {
      return done(null, result.rows[0]);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [profile.id, profile.emails[0].value]
    );

    if (existingUser.rows.length > 0) {
      // Update Google ID if user exists but doesn't have it
      if (!existingUser.rows[0].google_id) {
        await pool.query(
          'UPDATE users SET google_id = $1 WHERE id = $2',
          [profile.id, existingUser.rows[0].id]
        );
      }
      return done(null, existingUser.rows[0]);
    }

    // Create new user
    const newUser = await pool.query(
      `INSERT INTO users (username, email, google_id, avatar_url, email_verified, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        profile.displayName || profile.emails[0].value.split('@')[0],
        profile.emails[0].value,
        profile.id,
        profile.photos[0]?.value || null,
        true
      ]
    );

    return done(null, newUser.rows[0]);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;