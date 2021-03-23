const express = require("express");
const router = express.Router();
const user_api = require("../../../controllers/api/v1/user_api");

router.post("/create-session", user_api.createSession);
router.post("/create", user_api.create);

module.exports = router;
