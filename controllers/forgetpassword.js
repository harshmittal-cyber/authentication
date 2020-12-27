const User=require('../models/user');
const token=require('../models/token');
const random=require('randomstring');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
//for rendering user email confirmation for resetting the password
module.exports.forgetpassword=function(req,res){
    return res.render('forget_password',{
        title:"User Confirmation"
    })
}

module.exports.forget=function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('Error in finding the user',err);
        }
        if(!user){
            req.flash('error','Unauthorized User');
            return res.redirect('/users/signup')
        }

        if(user){
            let randomtoken=jwt.sign(user.toJSON(),'authentication',{expiresIn:'600000'});
            //creating token in database
            token.create({
                token:randomtoken,
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
                subject: 'Reset Password Email',
                text:'Reset Your password by clicking on link below \n \n  http://localhost:1000/reset/?token='+randomtoken+'\n \n This link is valid for only 10 min.',
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            req.flash('success','Link has been sent to your email')
            return res.redirect('back')
        }
        
    })
}