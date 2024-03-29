module.exports.home = function (req, res) {
  res.cookie("user_id", 25);
  return res.render("home", {
    title: "Authentication || Home",
  });
};

//logout handler
module.exports.destroysession = async function (req, res) {
  try {
    await req.logout();
    req.flash("success", "Logged Out Successfully");
    return res.redirect("/");
  } catch (err) {
    console.log("Error in finding your request", err);
  }
};
