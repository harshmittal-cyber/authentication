const otp = require("../../models/otp");

module.exports.otppage = function (req, res) {
  return res.render("otp", {
    title: "otp",
  });
};

module.exports.otpverify1 = async function (req, res) {
  try {
    let otp1 = await otp.findOne({ otp: req.body.otp });

    if (!otp1) {
      req.flash("error", "Incorrect otp");
      return res.redirect("back");
    }

    if (otp1 && otp1.email == req.body.email) {
      //delete otp if matched and return user profile
      await otp.findByIdAndDelete(otp1._id, function (err, token) {});

      req.flash("success", "Log In successful");

      return res.redirect("/");
    } else if (otp1 && otp1.email != req.body.email) {
      req.flash("error", "Incorrect otp");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
  }
};
