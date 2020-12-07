const express=require('express');
const router=express.Router();
const home_controller=require('../controllers/homecontroller');


router.get('/',home_controller.home);
router.use('/users',require('./users'));

module.exports=router;