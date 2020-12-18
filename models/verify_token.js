const mongoose=require('mongoose');

const verifySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    verifytoken:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const User=mongoose.model('token',verifySchema);

module.exports=User