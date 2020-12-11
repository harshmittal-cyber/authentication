const User=require('../models/user');
const bcrypt=require('bcrypt');
module.exports.profile=function(req,res){
        
        return res.render('user_profile',{    
            title:'Profile'     
        })
}

module.exports.signin=function(req,res){
    
    
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:'SignIn'
    })
}

module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:'SignUp'
    })
}

module.exports.create=function(req,res){
    //TODO LATER
    //if password not matches with confirm password
    if (req.body.password!=req.body.confirm_password){
        req.flash('error','Password Not matched')
        return res.redirect('back');    
    }
    
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error in finding a user'); return;}

        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log('Error in creating a user',err)}
                req.flash('success','User Created')
                return res.redirect('/users/signin');
            })
        }else{
            return res.redirect('back');
        }
    })

}

module.exports.createSession=function(req,res){
    req.flash('success','Logged In Successfully')
    return res.redirect('/');
}

module.exports.destroysession=function(req,res){
    req.logout();
    req.flash('success','Logged Out Successfully')
    return res.redirect('/')
}