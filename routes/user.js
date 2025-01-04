const express = require('express');
const wrapAsync = require('../Utils/wrapAsync'); // Utility function to catch async errors
const router = express.Router();
const User = require('../models/user'); // Your user model
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

// GET: Signup form
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

// GET: Login form
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

// POST: Signup logic
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { Username, Email, Password } = req.body.listing; // Use the exact key names as in your form
        if (!Username || !Email || !Password) {
            req.flash('error', 'All fields are required!');
            return res.redirect('/signup');
        }

        const newUser = new User({ username: Username, email: Email });
        const registeredUser = await User.register(newUser, Password);

        // req.flash('success', 'Welcome to Sightseers!');
        console.log(registeredUser);
       req.login(registeredUser,(err)=>{
        if(err){

            return next(err);
        }
        req.flash("success","Welcome to Sighseers!");
        res.redirect('/listings');
       });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

// POST: Login logic
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
   async (req, res) => {
        req.flash('success', 'Welcome back to Sightseers!');
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

//Logout of user
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you Out!");
        res.redirect("/listings");
    });
})
module.exports = router;
