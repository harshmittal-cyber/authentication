const express=require('express');
const router=express.Router();
const user_controller=require('../controllers/usercontroller')
router.use('/profile',user_controller.user);

module.exports=router;