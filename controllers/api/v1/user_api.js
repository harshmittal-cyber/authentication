const User=require('../../../models/user');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

module.exports.createSession=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});

        if(!user ){
            return res.status(422).json({
                message:'Invalid User'
            })
        }
        
        bcrypt.compare(req.body.password,user.password,function(err,result){
            if(!result){
                return res.status(422).json({
                    message:'Invalid Username or Password'
                })
            }else{
                return res.status(200).json({
                    message:'Sign In successfully',
                    data:jwt.sign(user.toJSON(),'authentication',{expiresIn:'10000'})
                })
            }
        })
    }catch(err){
        console.log('error',err);
        return res.status(500),json({
            message:"Internal Server Error"
        })
    }
}