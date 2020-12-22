const express=require('express');
const router=express.Router();
const home_controller=require('../controllers/homecontroller');
const verify_controller=require('../controllers/verify');
const forget_controller=require('../controllers/forgetpassword');

router.get('/',home_controller.home);
router.use('/users',require('./users'));
router.get('/verify',verify_controller.verify);

//forget password
router.get('/forgetpassword',forget_controller.forgetpassword);
router.post('/forget',forget_controller.forget);
module.exports=router;