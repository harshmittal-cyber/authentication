const User=require('../models/user');
const bcrypt=require('bcrypt');
const random=require('randomstring');
const token=require('../models/verify_token');
const nodemailer=require('nodemailer');
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
        if(user){
            req.flash('error','User already Exist');
            return res.redirect('/users/signup');
        }
        if(!user){
            bcrypt.hash(req.body.password,10,function(err,hash){
                User.create({
                    email:req.body.email,
                    password:hash,
                    name:req.body.name,
                    verified:false,
                })
            })
            //token generation
            let randomtoken=random.generate();

            //creating token in database
            token.create({
                verifytoken:randomtoken,
                email:req.body.email
            })
            //sending mails via nodemailer
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                port:587,
                auth: {
                  user: 'mittalh310@gmail.com',
                  pass: '$Abc1234'
                }
              });
              
              let mailOptions = {
                from: 'mittalh310@gmail.com',
                to: req.body.email,
                subject: 'Verification Email',
                text: 'Verify Your Email By clicking on Link: " <a href="http://localhost:1000/verify/?token='+randomtoken+'">"Verify</a>'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            req.flash('success','Verification Mail sent to your Email ')
            return res.redirect('/users/signin')
        }
    })

}