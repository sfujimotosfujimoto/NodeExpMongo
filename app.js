const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require('passport');



const mongoose = require("mongoose");

const app = express();

/**
 * Load Routes
 */
const students = require("./routes/students");
const users = require("./routes/users");

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');


/**
 * Map global promise to get rid of warning
 **/
mongoose.Promise = global.Promise;

/**
 * Connect to mongoose
 */

mongoose
  .connect(db.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/**
 * Handlebars Middleware
 **/
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/**
 * bodyParser
 **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Static folder
 **/
app.use(express.static(path.join(__dirname, "public")));

/**
 * method override middleware
 */

app.use(methodOverride("_method"));

/**
 * express-session middleware
 */
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

/**
 * connect-flash middleware
 */
app.use(flash());

/**
 * Global variables
 */
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// index route
app.get("/", (req, res) => {
  const title = "Welcome!";
  res.render("index", {
    title
  });
});

// about route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/students", students);
app.use("/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
