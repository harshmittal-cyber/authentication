//signin handler
const request = require("request");
const useragent = require("express-useragent");
const ip = require("ip");
module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user_sign_in", {
    title: "Authentication || SignIn",
  });
};

module.exports.createSession = async function (req, res) {
  try {
    const ip1 = await ip.address();
    let email = await req.body.email;
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
        subject: "Login detected",
        htmlContent: `You've successfully Logged in to your <b>Authentication</b> account just now. <br> Device:${req.useragent.os} <br> Browser:${req.useragent.browser} <br>IpAddress:${ip1}`,
      },
      json: true,
    };
    request(sendSMTPEmail, function (err, response, body) {
      if (err) {
        console.log("error", err);
      }
      console.log(body);
    });
    req.flash("success", "Log In Successfully");
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
