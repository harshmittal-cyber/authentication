const User=require('../models/user');
const token=require('../models/token');
const random=require('randomstring');
const nodemailer=require('nodemailer');

module.exports.forgetpassword=function(req,res){
    return res.render('forget_password',{
        title:"ForgetPassword"
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
            let randomtoken=random.generate();

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
                  user: 'mittalharsh4321@gmail.com',
                  pass: 'erharsh8492'
                }
              });
              
              let mailOptions = {
                from: 'mittalharsh4321@gmail.com',
                to: req.body.email,
                subject: 'Reset Password Email',
                text:'Reset Your password: " <a href="http://localhost:1000/reset/?token='+randomtoken+'">"Verify</a>'
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