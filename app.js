if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");  // ✅ Fixed Import
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL; 

async function main() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
}

main();

// Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "mysupersecretcode",
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("❌ Error in MONGO SESSION STORE:", err);
});

const sessionOptions = {
    store,
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

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Locals Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Route Mounting
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// Root Route
app.get("/", (req, res) => {
    res.render("home"); // Ensure you have a `home.ejs` file inside the `views` folder
});

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message, statusCode });
});

// Server Start
app.listen(8080, () => {
    console.log("🚀 Server is running on port 8080");
});
