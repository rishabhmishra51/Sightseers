const mongoose = require("mongoose");
// const review = require("./review");
const Schema = mongoose.Schema;
const review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: Number,

  // Image is now an object with filename and url fields
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/an-aerial-view-of-a-building-in-the-water-Jz4-YOEownY",
      set: (v) => (v === "" ? "https://unsplash.com/photos/an-aerial-view-of-a-building-in-the-water-Jz4-YOEownY" : v),
    },
  },

  location: String,
  country: String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref:"Review",

  },
],
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
   },
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
  }
})

// module.exports = mongoose.model('Listing', listingSchema);

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;