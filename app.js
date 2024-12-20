const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const wrapAsync = require("./Utils/wrapAsyc.js")
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const review = require("./models/review.js");

const Review = require("./models/review.js");

const passport= require("passport");
const LocalStrategy = require("passport-local");
const user= require("./models/user.js");

const userRouter =require("./routes/user.js");

app.use("/",userRouter);
// const { reviewSchema } = require("./schema.js");


// const validateReview = (req,res,next)=>{
//      let{error} = reviewSchema.validate(req,body);
//      if(error){
//           let errMsg = error.details.map((el)=>el.message).join("");
//           throw new ExpressError(400,errMsg);}
//       else{
//           next();
//       }    
//      };

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
main().then(()=>{
     console.log("connceted to db");    
})
.catch(err =>{
     console.log(err);
     
});

const sessionOptions = {
     secret:"mysupersecretcode",
     resave:false,
     saveUninitialized :true,
     cookie:{
          expires :Date.now()+7*24*60*60*1000,
          maxAge:7*24*60*60*1000,
          httpOnly:true,
     },
};

async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.get("/",(req,res)=>{
     res.send("Hi,I a root");
     
})
//index route
app.get("/listings",wrapAsync(async (req,res)=>{
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs",{allListings});
}));

// NEW Route create and Show route
app.get("/listings/new",(req,res)=>{
     res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
     const{id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if (!listing) {
          return next(new ExpressError("Listing not found!", 404)); // Handle case where listing is not found
      }
     res.render("listings/show.ejs",{listing});
}));

//new route
app.post("/listings",wrapAsync(async(req,res,next)=>{
        if(!req.body.listing){
          throw new ExpressError(400,"send valid data for listing")
        }
          const newListing = new Listing(req.body.listing);
          await newListing.save();
          res.redirect("/listings");
   
  
})
);

//edit 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
       let {id} = req.params;
       const listing = await Listing.findById(id);
       res.render("./listings/edit.ejs",{listing});
       
}));
//update
app.put("/listings/:id",wrapAsync(async (req,res)=>{
     if(!req.body.listing){
          throw new ExpressError(400,"send valid data for listing")
        }
     let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
}));

//review route
//post review route
app.post("/listings/:id/reviews",async(req,res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new review(req.body.review);
     listing.reviews.push(newReview);
     newReview.save();
     await listing.save();
     res.redirect(`/listings/${listing._id}`)
});

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
     let{id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
}))
// app.get("/testlisting",async(req,res)=>{
//    let sampleListing = new Listing({
//      title :"My New Villa",
//      description:"By the beach", 
//      price:1000,
//      location:"kushinagar",
//      country:"India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
   
// })
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     next();
});

app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"Page Not found!"))
});

app.use((err,req,res,next)=>{
     let {statusCode=500,message="Something went wrong"} = err;
     // res.status(statusCode).send(message);
     res.render("error.ejs",{message});
});

app.listen(8080,()=>{
     console.log("Server is listing");
     
});