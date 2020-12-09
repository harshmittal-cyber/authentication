const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const { use } = require('passport');
const saltRounds=10;

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
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

userSchema.methods.comparePassword=function(userpassword,next){
    bcrypt.compare(userpassword,this.password,function(err,result){
        if(err){return next(err); }

        next(null,result)
    })
}

const User=mongoose.model('User',userSchema);

module.exports=User;