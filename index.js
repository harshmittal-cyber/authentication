const express = require("express");
const env = require("./config/environment");
const app = express();
require("./config/view-helper")(app);
const port = process.env.PORT || 3000;
const logger = require("morgan");
const bodyParser = require("body-parser");

const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const connect = require("connect");
const sassMiddleware = require("node-sass-middleware");
//used for passportjs
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth-strategy");
const passportOneSessionPerUser = require("passport-one-session-per-user");
const passportJWT = require("./config/passport-jwt-strategy");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const { getLogger } = require("nodemailer/lib/shared");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//for cookies
app.use(cookieParser());

// if (env.name == "development") {
app.use(
  sassMiddleware({
    src: path.join(__dirname, env.asset_path, "scss"),
    dest: path.join(__dirname, env.asset_path, "css"),
    debug: false,
    outputStyle: "extended",
    prefix: "/css",
  })
);
// }

//for layouts
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));

//logger
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

//extract the styles
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//view engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "authentication",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "monfo store session cookie");
      }
    ),
  })
);

//storing passport sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("passport-one-session-per-user"));
app.use(passport.setAuthenticatedUser);

//for connect-flash msgs
app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log("ERROR in running a server");
  }
  console.log(`Server is running on port ${port}`);
});
