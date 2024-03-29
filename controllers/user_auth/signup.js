const User = require("../../models/user");
const bcrypt = require("bcrypt");
const random = require("randomstring");
const token = require("../../models/verify_token");
const request = require("request");

//signup handler
module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user_sign_up", {
    title: "Authentication || SignUp",
  });
};

// REGX* FOR VALIDATING NEW ENTERED EMAIL
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// VALIDATING NEW PASSCODE WITH REGX*
//IF TRUE
function validatePassword(password) {
  const re =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
  return re.test(password);
}

module.exports.create = async function (req, res) {
  try {
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

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      req.flash("error", "User already Exist");
      return res.redirect("/users/signup");
    }

    if (!user) {
      let hash = await bcrypt.hash(req.body.password, 10);

      await User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        verified: false,
      });
      //token generation
      let randomtoken = await random.generate();

      //creating token in database
      await token.create({
        verifytoken: randomtoken,
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
            link: "http://auth-team.herokuapp.com/verify/?token=" + randomtoken,
          },
          templateId: 4,
          subject: "Verify Email",
        },
        json: true,
      };
      request(sendSMTPEmail, function (err, response, body) {
        if (err) {
          console.log("error", err);
        }
        console.log(body);
      });

      req.flash("success", "Verification Mail sent to your Email ");
      return res.redirect("/users/signin");
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// htmlContent:
// 'Verify Your Email By clicking on Link: <a href="http://auth-team.herokuapp.com/verify/?token=' +
// randomtoken +
// '"><button style="cursor:pointer; padding:3px">Verify</button></a>',
