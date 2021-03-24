const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

const {generateAccessToken, generateRefreshToken} = require("./controllers/token_controller");

require("dotenv").config();

const userDB = mongoose.createConnection(process.env.USER_DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});
userDB.on("error", err => console.error(err.message));

const userSchema = require("./models/user");
const User = userDB.model("User", userSchema);

exports.signup_user = [
  body("username").trim().isLength({min: 6, max: 100}).withMessage("Must contain 6-100 characters").escape(),
  body("password").trim().isLength({min: 6, max: 100}).withMessage("Must contain 6-100 characters").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty())
      return res.status(400).json({autherrors: errors.mapped()});
      
    try {
      const registered = await User.findOne({username: req.body.username});

      if(registered) {
        const autherrors = {username: {msg: "username is already taken"}};
        return res.status(400).json({autherrors});
      }

      const hashedPwd = await bcrypt.hash(req.body.password, 10)

      const user = new User({
        username: req.body.username,
        password: hashedPwd
      });
      
      await user.save();

      res.sendStatus(201);
    } catch(err) {
        res.status(500).json(err);
    }
  }
]

exports.signin_user = [
  body("username").trim().isLength({min: 6, max: 100}).withMessage("Must contain 6-100 characters").escape(),
  body("password").trim().isLength({min: 6, max: 100}).withMessage("Must contain 6-100 characters").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({autherrors: errors.mapped()});
    }
      
    try {
      const user = await User.findOne({username: req.body.username});

      if(!user) {
        const autherrors = {username: {msg: "Username not found"}};
        return res.status(404).json({autherrors});
      }

      const correct = await bcrypt.compare(req.body.password, user.password);

      if(correct) {
        const accessToken = await generateAccessToken({username: user.username, _id: user._id});
        const refreshToken = await generateRefreshToken({username: user.username, _id: user._id});

        res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: true, maxAge: 1000 * 60 * 60 * 24});
        res.status(200).json({accessToken});
      } else {
          const autherrors = {password: {msg: "Incorrect password"}};
          res.status(404).json({autherrors});
      }
    } catch(err) {
        res.status(500).end();
    }
  } 
]

exports.signout_user = (req, res, next) => {
  res.clearCookie("refresh_token", {httpOnly: true, sameSite: true});
  res.sendStatus(200);
} 

