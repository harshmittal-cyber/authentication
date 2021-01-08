const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const env = require("../../../config/environment");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).json({
        message: "Invalid User",
      });
    }

    bcrypt.compare(req.body.password, user.password, function (err, result) {
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
    });
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
