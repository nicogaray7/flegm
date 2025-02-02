import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as TikTokStrategy } from 'passport-tiktok';
import { User } from '../models/User';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configuration Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails![0].value });

        if (!user) {
          user = await User.create({
            email: profile.emails![0].value,
            username: profile.displayName,
            googleId: profile.id,
            avatar: profile.photos![0].value,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Configuration Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails![0].value });

        if (!user) {
          user = await User.create({
            email: profile.emails![0].value,
            username: `${profile.name?.givenName} ${profile.name?.familyName}`,
            facebookId: profile.id,
            avatar: profile.photos![0].value,
          });
        } else if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Configuration TikTok Strategy
// passport.use(
//   new TikTokStrategy(
//     {
//       clientID: process.env.TIKTOK_CLIENT_KEY!,
//       clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
//       callbackURL: `${process.env.API_URL}/auth/tiktok/callback`,
//       scope: ['user.info.basic'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ tiktokId: profile.id });

//         if (!user) {
//           user = await User.create({
//             username: profile.displayName,
//             tiktokId: profile.id,
//             avatar: profile.avatarUrl,
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error as Error, undefined);
//       }
//     }
//   )
// );

export default passport; 