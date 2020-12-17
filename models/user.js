const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10;
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String
    }
},{
    timestamps:true
})



//to encrypt the password
userSchema.pre('save',function(next){
    var user=this;

    //if user modified the password or it is new password
    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(saltRounds,function(err,salt){
        if(err){return next(err)}

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err){return next(err)}
            user.password=hash;
            next();
        })
    })

})


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})
  
//static
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath=AVATAR_PATH;

const User=mongoose.model('User',userSchema);

module.exports=User;