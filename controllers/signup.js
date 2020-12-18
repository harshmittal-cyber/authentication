const User=require('../models/user');
const bcrypt=require('bcrypt');
const random=require('randomstring');

//signup handler
module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_up',{
        title:'SignUp'
    })
}
// REGX* FOR VALIDATING NEW ENTERED EMAIL
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());   
}
// VALIDATING NEW PASSCODE WITH REGX* 
//IF TRUE
function validatePassword(password) {
    const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
    return re.test(password); 
}

module.exports.create=function(req,res){

    const email=req.body.email;

    //checking if email is valid or not
    if(!validateEmail(email)){
        req.flash('error','Enter a valid email');
        return res.redirect('back');
    }
    //if password not matches with confirm password
    if (req.body.password!=req.body.confirm_password){
        req.flash('error','Password Not matched')
        return res.redirect('back');    
    }

    const password=req.body.password;
    //checking if password satisfy the secure password condition or not
    if(!validatePassword(password)){
        req.flash('error','Enter a valid password');
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error in finding a user'); return;}
        
        if(!user){
            bcrypt.hash(req.body.password,10,function(err,hash){
                User.create({
                    email:req.body.email,
                    password:hash,
                    name:req.body.name,
                    verified:false
                })


                req.flash('success','User created')
                return res.redirect('/users/signin')
            })
            
        }else{
            req.flash('error','User already exist')
            return res.redirect('back');
        }
    })

}