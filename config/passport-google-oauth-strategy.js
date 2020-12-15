const passport=require('passport');
const User = require('../models/user');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');


passport.use(new googleStrategy({
    clientID:"882676543438-9edmntqfbmruugl8m5fg85i7m6h4lu0k.apps.googleusercontent.com",
    clientSecret:"6tkgXj5RDmhrkKmkDA8o6q8U",
    callbackURL:"http://localhost:1000/users/auth/google/callback"
    },function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            //if err then return the error
            if(err){console.log('Error in passport-google-strategy',err); return;}
            console.log(profile);
            //if user is find then return the user
            if(user){
                return done(null,user)
            }else{
                //if user is not in database the create the user and return the user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:profile.displayName
                },function(err,user){
                    if(err){console.log('Error in creating a user'); return}

                    return done(null,user)
                })
            }
        })
    }
))


module.exports=passport;