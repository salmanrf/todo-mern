const express = require('express');
const router = express.Router();

const auth = require("../authentication");

router.use((req, res, next) => {
  console.log(req.ip);
  next();
})

router.post("/signup", auth.signup_user); 
router.post("/signin", auth.signin_user);
router.get("/signout", auth.signout_user);

module.exports = router;
