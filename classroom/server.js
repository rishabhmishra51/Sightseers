const express = require("express");
const app = express();
const users = require("../routes/user.js");
const session = require("express-session");

const sessionOptions ={
     secret : "mysupersecretstring",resave:false,
     saveUninitialized:true,

};

app.use(session(sessionOptions));

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// app.get("/",(req,res)=>{
//      console.dir(req.cookies);
//      res.send("Hi I am root");
// });



// app.get("/getcookies",(req,res) =>{
//      res.cookie("great","hello");
//      res.send("sent you some cookies!");
//      res.cookie("greet","namaste");
// });

// app.use("/users",users);
 
app.get("/register",(req,res)=>{
     let{name = "anoymous"}= req.query;
     req.session.name = name;
     res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
     res.send(`hello , ${req.session.name}`);
});

app.get("/reqcount", (req,res)=>{
     if(req.session.count){
          req.session.count++;
     }
     else{
          req.session.count=1;
     }
     
     res.send(`you sent a request ${req.session.count} times`);
});
app.get("/test",(req,res)=>{
     res.send("test successful!");
});

app.listen(3000,()=>{
     console.log("Server is listening to 3000");
     
});