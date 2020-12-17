const express=require('express');
const passport=require('passport');
const router=express.Router();
const user_controller=require('../controllers/usercontroller')
const signup_controller=require('../controllers/signup');
const signin_controller=require('../controllers/signin');
const signout_controller=require('../controllers/signout');

//User update and profile router
router.get('/profile/:id',passport.checkAuthentication,user_controller.profile);
router.post('/update/:id',user_controller.update);

//SignIn router
router.get('/signin',signin_controller.signin);
router.post('/create-session',
    passport.authenticate('local',{
        failureRedirect:'/users/signin'
    }
),signin_controller.createSession);

//SignUp router
router.get('/signup',signup_controller.signup);
router.post('/create',signup_controller.create);


//Google Auth Router
router.get('/auth/google',
    passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',
        passport.authenticate('google',{
            failureRedirect:'/users/signin',
        }
    ),signin_controller.createSession);

router.get('/destroysession',signout_controller.destroysession);

module.exports=router;