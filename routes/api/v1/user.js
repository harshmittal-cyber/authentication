const express=require('express');
const router=express.Router();
const user_api=require('../../../controllers/api/v1/index')

router.get('/',user_api.index)


module.exports=router;