const express = require("express");
const passport = require("passport");
const router = express.Router();
const home_controller = require("../controllers/user_auth/homecontroller");
const user_controller = require("../controllers/user_auth/usercontroller");
const signup_controller = require("../controllers/user_auth/signup");
const signin_controller = require("../controllers/user_auth/signin");
const totp = require("../controllers/otp/otpgenerator");
const otpverify = require("../controllers/otp/otpverification");

//User update and profile router
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  user_controller.profile
);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  user_controller.update
);

//delete the account
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  user_controller.delete
);

//SignIn router
router.get("/signin", signin_controller.signin);
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/users/signin",
  }),
  signin_controller.createSession
);

//SignUp router
router.get("/signup", signup_controller.signup);
router.post("/create", signup_controller.create);

//Google Auth Router
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//signin with google route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/signin",
  }),
  signin_controller.createSession
);

//logout router
router.get("/destroysession", home_controller.destroysession);

//render 2fa page
router.get("/2fa", otpverify.otppage);

router.post("/otp-verify", otpverify.otpverify1);

module.exports = router;
