const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
// mongoose.connect(`mongodb://localhost/authentication1`);

mongoose.connect(
  "mongodb+srv://harsh_mittal18:erharsh8492@cluster0.cefhy.mongodb.net/authentication1?retryWrites=true&w=majority"
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function () {
  console.log("Connecting To database::MongoDB");
});

module.exports = db;
