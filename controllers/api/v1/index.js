module.exports.index=function(req,res){
    return res.json(200,{
        message:'List of User',
        users:[]
    })
}