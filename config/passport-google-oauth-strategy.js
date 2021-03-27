const passport = require("passport");
const User = require("../models/user");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const token = require("../models/verify_token");
const env = require("./environment");
const generator = require("generate-password");
const bcrypt = require("bcrypt");

passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_call_back_url,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        //if err then return the error
        if (err) {
          console.log("Error in passport-google-strategy", err);
          return;
        }

        //if user is find then return the user
        if (user) {
          console.log(profile);
          return done(null, user);
        } else {
          const password = generator.generate({
            length: 11,
            numbers: true,
            lowercase: true,
            uppercase: true,
          });
          bcrypt.hash(password, 10, function (err, hash) {
            //if user is not in database the create the user and return the user
            User.create(
              {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: hash, //for validation of password
                verified: profile.emails[0].verified,
                google: true,
              },
              function (err, user) {
                if (err) {
                  console.log("Error in creating a user", err);
                  return;
                }
                return done(null, user);
              }
            );
          });
        }
      });
    }
  )
);

module.exports = passport;
