
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main()
.then(()=>{
     console.log("connceted to db");    
})
.catch(err =>{
     console.log(err);
     
});
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//cleaning and adding our data
const initDB = async () =>{
     await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({...obj,
          owner:"6775376ee601e3243cab0b91"
     }));
     await Listing.insertMany(initData.data);
     console.log("data was initialized");  
};
initDB();