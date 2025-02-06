import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import FacebookTokenStrategy from 'passport-facebook-token';
import { User, IUser } from '@models/User';
import logger from '@config/logger';

const configurePassport = (): void => {
  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    if (!process.env.API_URL) {
      logger.error(
        'API_URL environment variable is not defined. Google OAuth callback URL will not work correctly.'
      );
      return;
    }

    const callbackURL = `${process.env.API_URL}/auth/google/callback`;
    if (!callbackURL.startsWith('http')) {
      logger.error('Invalid API_URL format. Must start with http:// or https://');
      return;
    }

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
          passReqToCallback: true,
        },
        (req, accessToken, refreshToken, profile, done) => {
          void (async () => {
            try {
              // Check if user exists
              const existingUser = await User.findOne({
                $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }],
              });

              if (existingUser) {
                // Update existing user if necessary
                existingUser.googleId = profile.id;
                await existingUser.save();
                done(null, existingUser);
                return;
              }

              // Create new user
              const newUser = new User({
                username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
                email: profile.emails?.[0]?.value,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
                isVerified: true,
              });

              await newUser.save();
              done(null, newUser);
            } catch (error) {
              logger.error('Google authentication error:', error);
              done(error as Error);
            }
          })();
        }
      )
    );
  } else {
    logger.warn('Google OAuth credentials not configured');
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookTokenStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        (accessToken, refreshToken, profile, done) => {
          void (async () => {
            try {
              // Check if user exists
              const existingUser = await User.findOne({
                $or: [{ facebookId: profile.id }, { email: profile.emails?.[0]?.value }],
              });

              if (existingUser) {
                // Update existing user if necessary
                existingUser.facebookId = profile.id;
                await existingUser.save();
                done(null, existingUser);
                return;
              }

              // Create new user
              const newUser = new User({
                username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
                email: profile.emails?.[0]?.value,
                facebookId: profile.id,
                avatar: profile.photos?.[0]?.value,
                isVerified: true,
              });

              await newUser.save();
              done(null, newUser);
            } catch (error) {
              logger.error('Facebook authentication error:', error);
              done(error as Error);
            }
          })();
        }
      )
    );
  } else {
    logger.warn('Facebook OAuth credentials not configured');
  }

  // Serialization
  passport.serializeUser((user: Express.User, done) => {
    const userDoc = user as IUser;
    done(null, userDoc._id);
  });

  // Deserialization
  passport.deserializeUser((id: string, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });
};

export default configurePassport;
