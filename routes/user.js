const express = require('express');
const wrapAsync = require('../Utils/wrapAsync');
const router = express.Router();
const user = require('../models/user');

router.get("/signup",(req,res)=>{
     res.render("users/signup.ejs");
});
router.get("/login",(req,res)=>{
     res.render("users/login.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
     try{
     let{username,email,password}=req.body;
     const newUser = new user({email,username});
     const registeredUser = await user.register(newUser,password);
     console.log(registeredUser);
     req.flash("success","Welcome to Sightseers");
     res.redirect("/listings");
     } catch(e){
          req.flash("error",e.message);
          res.redirect("/signup");
     }
}))

module.exports=router;