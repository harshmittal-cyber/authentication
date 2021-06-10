const express = require("express");
const router = express.Router();
const home_controller = require("../controllers/user_auth/homecontroller");
const verify_controller = require("../controllers/reset_password/verify");
const forget_controller = require("../controllers/reset_password/forgetpassword");
const reset_controller = require("../controllers/reset_password/reset_controller");
const otp_controller=require('../controllers/otp/otpgenerator')

router.get("/", home_controller.home);
router.use("/users", require("./users"));
router.post('/resend',otp_controller.otp)
router.get("/verify", verify_controller.verify);

//forget password
router.get("/forgetpassword", forget_controller.forgetpassword);
router.post("/forget", forget_controller.forget);
router.get("/reset", reset_controller.reset);
router.post("/resetpassword", reset_controller.resetpassword);

module.exports = router;
