const mongoose=require('mongoose');

const tokenSchema=new mongoose.Schema({
    //to find the user for reseting the password using email
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    //to verify the age of token
    created:{
        type:Number,
        required:true,
        default:Date.now()
    }
})

const User=mongoose.model('tokenSchema',tokenSchema);

module.exports=User;