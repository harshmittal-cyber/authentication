const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt=require('bcrypt');
const passportOneSessionPerUser=require('passport-one-session-per-user');

passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true,
    },function(req,email,password,done){
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err)
                return done(err)
            }
    
            if(!user){
                req.flash('error','Invalid Username or Password')
                return done(null,false)
            }
            bcrypt.compare(password,user.password,function(err,result){
                if(!result){
                    req.flash('error','Invalid Username or Password')
                    return done(null,false);
                }
                if(user.verified===false){
                   //if email is not verified
                   req.flash('error','Please Verify Your email')
                    return done(null,false,{message:'Email Not verified'})
                }else{
                    // req.flash('success','Logged In Successfully')
                    return done(null,user)
                }
            })
        })
    }    
))

//it remove the pre session if we logged in in another tab
passport.use(new passportOneSessionPerUser())


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