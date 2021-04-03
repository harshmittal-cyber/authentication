const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const env = require("../../config/environment");
const random = require("randomstring");
const nodemailer = require("nodemailer");
const token = require("../../models/verify_token");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).json({
        message: "Invalid User",
      });
    }

    await bcrypt.compare(
      req.body.password,
      user.password,
      function (err, result) {
        if (err) {
          console.log("error", err);
          return res.status(400).json({
            message: "Bad Request Check your Internet Connection",
          });
        }
        if (!result) {
          return res.status(422).json({
            message: "Invalid Username or Password",
          });
        } else {
          return res.status(200).json({
            message: user,
            data: jwt.sign(user.toJSON(), env.jwt_secret, {
              expiresIn: "600000",
            }),
          });
        }
      }
    );
  } catch (err) {
    console.log("error", err);
    return (
      res.status(500),
      json({
        message: "Internal Server Error",
      })
    );
  }
};

// REGX* FOR VALIDATING NEW ENTERED EMAIL
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// VALIDATING NEW PASSCODE WITH REGX*
//IF TRUE
function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
  return re.test(password);
}

module.exports.create = function (req, res) {
  const email = req.body.email;

  //checking if email is valid or not
  if (!validateEmail(email)) {
    req.flash("error", "Enter a valid email");
    return res.redirect("back");
  }
  //if password not matches with confirm password
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Password Not matched");
    return res.redirect("back");
  }

  const password = req.body.password;
  //checking if password satisfy the secure password condition or not
  if (!validatePassword(password)) {
    req.flash("error", "Enter a valid password");
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding a user");
      return;
    }
    if (user) {
      req.flash("error", "User already Exist");
      return res.redirect("/users/signup");
    }
    if (!user) {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          verified: false,
        });
      });
      //token generation
      let randomtoken = random.generate();

      //creating token in database
      token.create({
        verifytoken: randomtoken,
        email: req.body.email,
      });
      //sending mails via nodemailer
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
          user: "mittalh310@gmail.com",
          pass: "erauth8492",
        },
      });

      let mailOptions = {
        from: "mittalh310@gmail.com",
        to: req.body.email,
        subject: "Verification Email",
        text:
          'Verify Your Email By clicking on Link: " <a href="http://localhost:2000/verify/?token=' +
          randomtoken +
          '">"Verify</a>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      req.flash("success", "Verification Mail sent to your Email ");
      return res.redirect("/users/signin");
    }
  });
};
