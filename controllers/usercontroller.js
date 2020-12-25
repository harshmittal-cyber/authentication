const User=require('../models/user');
const fs=require('fs');
const path=require('path');

module.exports.profile=function(req,res){   
    return res.render('user_profile',{    
        title:'Profile'     
    })
}


//profile update handler
module.exports.update=async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            // User.update(req.body);
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

module.exports.delete=function(req,res){
    User.findByIdAndRemove({_id:req.params.id},function(err,user){
        if(err){
            console.log('error',err);
            req.flash('error',err);
            return res.redirect('back')
        }
        if(user.avatar){
            //unlink the file from server if user delete the account
            fs.unlinkSync(path.join(__dirname,'..',user.avatar))
        }
        console.log('Account Deleted')
        req.flash('success','Account Deleted');
        req.logout();
        return res.redirect('/')
    })
}