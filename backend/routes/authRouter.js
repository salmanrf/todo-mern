const express = require('express');
const router = express.Router();

const auth = require("../authentication");

router.post("/signup", auth.signup_user); 
router.post("/signin", auth.signin_user);
router.get("/signout", auth.signout_user);

module.exports = router;
