const passport=require('passport');
const FacebookStrategy=require('passport-facebook');
const crypto=require('crypto');
const User=require('../models/user');

passport.use(new FacebookStrategy({
    clientID:1481609062229823,
    clientSecret:"7015ffff2f4655a8b3ee61812d77bcc1",
    callbackURl:'http://localhost:1000/users/auth/facebook/callack',
    profileFields:['id','displayName','emails','photos']
    },function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exex(function(err,user){
            if(err){
                console.log('Error in fetching a user',err);
                return;
            }

            if(user){
                return done(null,user)
            }else{
                User.create({
                    
                })
            }
        })
    }
))