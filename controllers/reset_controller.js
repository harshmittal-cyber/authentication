const User = require("../models/user");
const token = require("../models/token");
const bcrypt = require("bcrypt");
const duration = 600000; //only for 10mins

//to show the form for resetting password if link is not expired
module.exports.reset = function (req, res) {
  token.findOne({ token: req.query.token }, function (err, tokenf) {
    if (err) {
      console.log("error", err);
    }

    //if token isvalid the show the reset pasword form
    if (tokenf && Date.now() - tokenf.created < duration) {
      res.render("reset_form", {
        title: "Reset Password",
        token: tokenf.token,
        email: tokenf.email,
      });
    } else {
      //if token is expired the delete the token from database
      token.findByIdAndDelete(tokenf._id, function (err, token) {});
      req.flash("error", "Link was expired or invalid");
      return res.redirect("/");
    }
  });
};

//for updating or resettting the password
module.exports.resetpassword = function (req, res) {
  token.findOne({ token: req.body.token }, function (err, tokenf) {
    //if token is not expired then reset the passsword
    if (tokenf && Date.now() - tokenf.created < duration) {
      User.findOne({ email: tokenf.email }, function (err, user) {
        //password check for strong password
        function validatePassword(password) {
          const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
          return re.test(password);
        }

        //matching the form password with password check validation function
        if (validatePassword(req.body.reset_password)) {
          //if password match then delete the token and update the user password
          if (req.body.reset_password === req.body.reset_confirm_password) {
            token.findByIdAndDelete(tokenf._id, function (err, token) {});
            bcrypt.hash(req.body.reset_password, 10, function (err, hash) {
              User.findByIdAndUpdate(
                user._id,
                { password: hash, google: false },
                function (err, user) {
                  console.log("Password changed");
                }
              );
            });
            req.flash("success", "Password changed successfully");
            return res.redirect("/users/signin");
          } else {
            console.log("Password Mismatched");
            req.flash("error", "Password not matched");
            return res.redirect("back");
          }

          //if password is not valid then it send Invalid password
        } else {
          console.log("Invalid Password");
          req.flash("error", "Invalid Password");
          return res.redirect("back");
        }
      });
      //if token got expired then send the message link was expired
    } else {
      console.log("Link was expired");
      req.flash("error", "Link was expired");
      return res.redirect("/users/signin");
    }
  });
};
