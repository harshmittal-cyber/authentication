const express=require('express');
const router=express.Router();
const home_controller=require('../controllers/homecontroller');
const verify_controller=require('../controllers/verify');


router.get('/',home_controller.home);
router.use('/users',require('./users'));
router.get('/verify',verify_controller.verify);

module.exports=router;