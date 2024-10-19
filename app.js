const express = require("express")
const app = express();
const mongoose = require("mongoose");
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
app.listen(8080,()=>{
     console.log("Server is listing");
     
});