const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
     res.render('users/signup');
 }

module.exports.signup =async (req, res) => {
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
}


module.exports.renderLoginForm = (req, res) => {
     res.render('users/login.ejs');
 }

 module.exports.login = async (req, res) => {
     req.flash('success', 'Welcome back to Sightseers!');
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
 }

 module.exports.logout=(req,res)=>{
     req.logout((err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Logged you Out!");
         res.redirect("/listings");
     });
 }