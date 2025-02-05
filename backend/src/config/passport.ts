import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import FacebookTokenStrategy from 'passport-facebook-token';
import { User, IUser } from '../models/User';
import logger from './logger';

// Configuration des stratégies OAuth
const configurePassport = (): void => {
  // Stratégie Google
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value }
          ]
        });

        if (existingUser) {
          // Mettre à jour l'utilisateur existant si nécessaire
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
          email: profile.emails?.[0]?.value,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        logger.error('Erreur lors de l\'authentification Google', { error });
        return done(error);
      }
    }));
  } else {
    logger.warn('⚠️ Stratégie Google OAuth non configurée - Identifiants manquants');
  }

  // Stratégie Facebook Token
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookTokenStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      profileFields: ['id', 'displayName', 'emails', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
          $or: [
            { facebookId: profile.id },
            { email: profile.emails?.[0]?.value }
          ]
        });

        if (existingUser) {
          // Mettre à jour l'utilisateur existant si nécessaire
          existingUser.facebookId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
          email: profile.emails?.[0]?.value,
          facebookId: profile.id,
          avatar: profile.photos?.[0]?.value
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        logger.error('Erreur lors de l\'authentification Facebook', { error });
        return done(error);
      }
    }));
  } else {
    logger.warn('⚠️ Stratégie Facebook OAuth non configurée - Identifiants manquants');
  }

  // Sérialisation et désérialisation de l'utilisateur
  passport.serializeUser((user: Express.User, done) => {
    const userDoc = user as IUser;
    done(null, userDoc._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default configurePassport; 