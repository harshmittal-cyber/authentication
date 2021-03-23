const express = require("express");
const router = express.Router();
const verify_controller = require("../../../controllers/verify");
router.use("/users", require("./users"));
router.get("/verify", verify_controller.verify);

module.exports = router;
