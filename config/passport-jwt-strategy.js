const passport=require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User=require('../models/user');
const bcrypt=require('bcrypt');

let opts={
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'authentication'
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            return done(null, false);
        } 
        return done(null,user)      
    });
}));


module.exports=passport