const User=require('../models/user');
const bcrypt=require('bcrypt');

//signin handler
module.exports.signin=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_in',{
        title:'SignIn'
    })
}

module.exports.createSession=function(req,res){
    req.flash('success','Logged In Successfully')
    return res.redirect('/');
}
