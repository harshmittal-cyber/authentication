module.exports.home = function (req, res) {
  res.cookie("user_id", 25);
  return res.render("home", {
    title: "Authentication || Home",
  });
};
