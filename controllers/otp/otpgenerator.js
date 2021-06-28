const otp = require("../../models/otp");
const otpgenerator = require("otp-generator");
const request = require("request");

module.exports.otp = async function (req, res) {
  try {
    let email = await req.body.email;
    let otpgenerate1 = await otpgenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true,
    });
    //creating token in database
    await otp.create({
      otp: otpgenerate1,
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
        // templateId:2
        subject: "Verify Email",

        htmlContent: `your otp is ${otpgenerate1}. Otp valid for only 1 min`,
      },
      json: true,
    };
    request(sendSMTPEmail, function (err, response, body) {
      if (err) {
        console.log("error", err);
      }
      console.log(body);
    });
    req.flash("success", "OTP Sent to your email");
    return res.redirect("/users/2fa");
  } catch (err) {
    console.log(err);
  }
};
