const User=require('../models/user');
const token=require('../models/verify_token');


module.exports.verify=function(req,res){
    token.findOne({verifytoken:req.query.token},function(err,tokenverify){
        console.log(tokenverify);

        if(tokenverify){
            User.findOne({email:tokenverify.email},function(err,userverified){
                if(userverified){
                    //if user verified then update the user
                    User.findByIdAndUpdate(userverified._id,{verified:true,google:true},function(err,user){
                        console.log('verified')
                    })
                
                    //fter updating delete the token
                    token.findByIdAndDelete(tokenverify._id,function(err,tokenverify){
                        console.log('token Deleted')
                    })

                    req.flash('success','Your Email is Verified');
                    return res.redirect('/users/signin');
                }else{
                    req.flash('error','Email Not Found');
                    return res.redirect('/users/signin')
            }
        })
        }else{
            req.flash('error','Invalid Link or Token Expired')
            return res.redirect('/users/signin')
        }
    })
}