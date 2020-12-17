const User=require('../models/user');
const bcrypt=require('bcrypt');

//signup handler
module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
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
            req.flash('error','User already exist')
            return res.redirect('back');
        }
    })

}