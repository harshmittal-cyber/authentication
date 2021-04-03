const express = require("express");
const router = express.Router();
const user_api = require("../../api/v1/user_api");

router.post("/login", user_api.createSession);
router.post("/signup", user_api.create);

module.exports = router;
