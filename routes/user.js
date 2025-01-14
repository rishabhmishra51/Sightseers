const express = require('express');
const wrapAsync = require('../Utils/wrapAsync'); // Utility function to catch async errors
const router = express.Router();
const User = require('../models/user'); // Your user model
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js");
// GET: Signup form
router.get('/signup', userController.renderSignupForm);


router
.route("/login")
// GET: Login form
.get( userController.renderLoginForm)
// POST: Login logic
.post(
    
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
   userController.login
);


// POST: Signup logic
router.post('/signup', wrapAsync(userController.signup));

//Logout of user
router.get("/logout",userController.logout)
module.exports = router;
