const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    //to find the user for reseting the password using email
    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    expireAt:{
        type:Date,
        default:Date.now,
        index:{expires:'1m'}
    }
   
},{
    timestamps:true
})

const otp=mongoose.model('otp',otpSchema);

module.exports=otp;