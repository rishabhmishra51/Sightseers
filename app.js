if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
// const ExpressError = require("./Utils/ExpressError.js");
const ExpressError = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
// Models
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// Routes
const reviewRoutes = require("./routes/review.js");
const listingRoutes = require("./routes/listing.js");
const userRoutes = require("./routes/user.js");

// Middleware & Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //store user related info.
passport.deserializeUser(User.deserializeUser());

// Flash & Locals Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log(res.locals.success);
    
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// MongoDB Connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to DB");
}
main().catch((err) => console.log(err));

// Route Mounting
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to Sighseers");
});

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message, statusCode });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
