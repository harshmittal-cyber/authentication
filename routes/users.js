const express=require('express');
const router=express.Router();
const user_controller=require('../controllers/usercontroller')


router.get('/profile',user_controller.user);
router.get('/sign-in',user_controller.signin);
router.get('/sign-up',user_controller.signup);

router.post('/create',user_controller.create);
router.post('/create-session',user_controller.createSession);



module.exports=router;