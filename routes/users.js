const express=require('express');
const passport=require('passport');

const router=express.Router();
const user_controller=require('../controllers/usercontroller')

router.get('/profile/:id',passport.checkAuthentication,user_controller.profile);
router.post('/update/:id',user_controller.update);

router.get('/signin',user_controller.signin);
router.get('/signup',user_controller.signup);

router.post('/create',user_controller.create);
router.post('/create-session',
    passport.authenticate('local',{
        failureRedirect:'/users/signin'
    }
),user_controller.createSession);


router.get('/auth/google',
    passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',
        passport.authenticate('google',{
            failureRedirect:'/users/signin',
        }
    ),user_controller.createSession);

router.get('/destroysession',user_controller.destroysession);

module.exports=router;