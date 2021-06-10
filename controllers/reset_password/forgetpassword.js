const User = require("../../models/user");
const token = require("../../models/token");
const jwt = require("jsonwebtoken");
const env = require("../../config/environment");
const request = require("request");

//for rendering user email confirmation for resetting the password
module.exports.forgetpassword = function (req, res) {
  return res.render("forget_password", {
    title: "User Confirmation",
  });
};

module.exports.forget = function (req, res) {
  const email = req.body.email;
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
      //sending email via sendinblue api
      let sendSMTPEmail = {
        method: "POST",
        Port: 587,
        url: "https://api.sendinblue.com/v3/smtp/email",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key":
            "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",
        },
        body: {
          sender: {
            name: "Team Authentication",
            email: "mittalharsh4321@gmail.com",
          },
          to: [{ email: email }],
          replyTo: { email: "mittalharsh4321@gmail.com" },
          params: {
            link: "http://auth-team.herokuapp.com/reset/?token=" + randomtoken,
          },
          templateId: 3,
          subject: "Reset your password",
        },
        json: true,
      };
      request(sendSMTPEmail, function (err, response, body) {
        if (err) {
          console.log("error", err);
        }
        console.log(body);
      });

      req.flash("success", "Link has been sent to your email");
      return res.redirect("back");
    }
  });
};

// htmlContent:
//   'Reset your password By clicking on Link: " <a href="http://auth-team.herokuapp.com/reset/?token=' +
//   randomtoken +
//   '">"Reset your password</a>. This lInk is valid for only 10 minutes',
