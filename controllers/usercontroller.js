const User=require('../models/user');
const bcrypt=require('bcrypt');
const fs=require('fs');
const path=require('path');

module.exports.profile=function(req,res){   
        return res.render('user_profile',{    
            title:'Profile'     
        })
}

//signin handler
module.exports.signin=function(req,res){
    
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:'SignIn'
    })
}

module.exports.createSession=function(req,res){
    req.flash('success','Logged In Successfully')
    return res.redirect('/');
}

//signup handler
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
            req.flash('error','User already exist')
            return res.redirect('back');
        }
    })

}

//profile update handler
module.exports.update=async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('Multer error:',err);}

                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){
                    //if avatar is already there and we choose to update it then we have to unlink the previous one
                    if(user.avatar){
                        // for deleting file we need fs
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }

                    user.avatar=User.avatarPath + '/' +req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })

        }catch(err){
            req.flash('error'.err);
            return res.redirect('back');
        }
    }
}


//logout handler 
module.exports.destroysession=function(req,res){
    req.logout();
    req.flash('success','Logged Out Successfully')
    return res.redirect('/')
}