// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");
// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/resthub", {
  useNewUrlParser: true,
});
var db = mongoose.connection;

// Added check for DB connection
if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get("/", (req, res) =>
  res.send("Welcome to Kaibin's CS3219 Task B Project")
);

// Use Api routes in the App
app.use("/api", apiRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running Task B on port " + port);
});
