const express = require("express");
const router = express.Router();
const home_controller = require("../controllers/homecontroller");
const verify_controller = require("../controllers/verify");
const forget_controller = require("../controllers/forgetpassword");
const reset_controller = require("../controllers/reset_controller");

router.get("/", home_controller.home);
router.use("/users", require("./users"));
//api routes
router.use("/api", require("../api_routes"));

router.get("/verify", verify_controller.verify);

//forget password
router.get("/forgetpassword", forget_controller.forgetpassword);
router.post("/forget", forget_controller.forget);
router.get("/reset", reset_controller.reset);
router.post("/resetpassword", reset_controller.resetpassword);

module.exports = router;
