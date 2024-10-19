const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
main().then(()=>{
     console.log("connceted to db");    
})
.catch(err =>{
     console.log(err);
     
});
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.get("/",(req,res)=>{
     res.send("Hi,I a root");
     
})
app.get("/testlisting",async(req,res)=>{
   let sampleListing = new Listing({
     title :"My New Villa",
     description:"By the beach", 
     price:1000,
     location:"kushinagar",
     country:"India",
   });
   await sampleListing.save();
   console.log("sample was saved");
   res.send("successful testing");
   
})
app.listen(8080,()=>{
     console.log("Server is listing");
     
});