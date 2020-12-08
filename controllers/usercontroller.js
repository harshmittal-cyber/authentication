const User=require('../models/userschema');

module.exports.user=function(req,res){
    return res.render('user_profile',{
        title:'Profile'
    })
}

module.exports.signin=function(req,res){
    return res.render('user_sign_in',{
        title:'SignIn'
    })
}

module.exports.signup=function(req,res){
    return res.render('user_sign_up',{
        title:'SignUp'
    })
}

module.exports.create=function(req,res){
    //TODO LATER
    //if password not matches with confirm password
    if (req.body.password!=req.body.confirm_password){
        return res.redirect('back');    
    }
    
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('Error in finding a user',err)}

        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log('Error in creating a user',err)}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    })

}

module.exports.createSession=function(req,res){
    
}