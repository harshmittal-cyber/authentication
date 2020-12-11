const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt=require('bcrypt');

passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
        // passReqToCallback:true
    },function(email,password,done){
        User.findOne({email:email},function(err,user){
            if(err){return done(err)}
    
            if(!user){
                return done(null,false)
            }
            

            bcrypt.compare(password,user.password,function(err,result){
                if(!result){
                   return done(null,false);
                }

                if(user.email===false){
                   //if email is not verified
                    return done(null,false)
                }
                //if result comes then return the user
                if(result){
                    return done(null,user)
                }
            })
        })
    }    
))

//serialize a user means user.id is stored as cookie in browser
passport.serializeUser(function(user,done){
    done(null,user.id)
});

//deserialize a user means it check in database whether the cookie is matched with id or not
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user')
            return done(err)
        }
        return done(null,user);
    })
})

passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }

    //if user is not signed in
    return res.redirect('/users/signin')
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the signed in user information
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;