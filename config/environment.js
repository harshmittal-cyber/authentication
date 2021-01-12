const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory || fs.mkdirSync(logDirectory));

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "anything",
  db: "authentication",
  smtp: {
    service: "gmail",
    port: 587,
    auth: {
      user: "mittalh310@gmail.com",
      pass: "$Abc1234",
    },
  },
  google_client_id:
    "882676543438-9edmntqfbmruugl8m5fg85i7m6h4lu0k.apps.googleusercontent.com",
  google_client_secret: "Rfh-8OEzfLK0Vo3lQJW42PrF",
  google_call_back_url: "http://localhost:1000/users/auth/google/callback",
  jwt_secret: "authentication",
  google_password: "$Dca1567",
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

//production environment
const production = {
  name: "production",
  asset_path: process.env.AUTH_ASSET_PATH,
  session_cookie_key: process.env.AUTH_SESSION_COOKIE_KEY,
  db: process.env.AUTH_DB,
  smtp: {
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.AUTH_GMAIL_USERNAME,
      pass: process.env.AUTH_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.AUTH_GOOGLE_CLIEND_ID,
  google_client_secret: process.env.AUTH_GOOGLE_CLIEND_SECRET,
  google_call_back_url: process.env.AUTH_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.AUTH_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports = eval(
  process.env.AUTH_ENVIRONMENT === undefined
    ? development
    : eval(process.env.AUTH_ENVIRONMENT)
);
