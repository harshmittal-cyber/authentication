const User = require("../models/user");
const token = require("../models/token");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
//for rendering user email confirmation for resetting the password
module.exports.forgetpassword = function (req, res) {
  return res.render("forget_password", {
    title: "User Confirmation",
  });
};

module.exports.forget = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding the user", err);
    }
    if (!user) {
      req.flash("error", "Unauthorized User");
      return res.redirect("/users/signup");
    }

    if (user) {
      let randomtoken = jwt.sign(user.toJSON(), env.jwt_secret, {
        expiresIn: "600000",
      });
      //creating token in database
      token.create({
        token: randomtoken,
        email: req.body.email,
      });
      //sending mails via nodemailer
      let transporter = nodemailer.createTransport(env.smtp);

      let mailOptions = {
        from: "mittalh310@gmail.com",
        to: req.body.email,
        subject: "Reset Password Email",
        text:
          "Reset Your password by clicking on link below \n \n  http://localhost:1000/reset/?token=" +
          randomtoken +
          "\n \nThis link is valid for only 10 min.\n Thanks \n Team Authentication",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      req.flash("success", "Link has been sent to your email");
      return res.redirect("back");
    }
  });
};
