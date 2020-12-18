const mongoose=require('mongoose');


const tokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    created:{

        //TO VERIFY THE AGE OF TOKEN
        type:Number,
        required:true,
        default:Date.now()
    }
})

const User=mongoose.model('token',tokenSchema);

module.exports=User;