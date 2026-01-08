import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleUser = {
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.name?.givenName,
          lastName: profile.name?.familyName,
          photo: profile.photos?.[0]?.value,
        };

        return done(null, googleUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
