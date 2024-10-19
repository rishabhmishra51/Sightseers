const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

// module.exports = mongoose.model('Listing', listingSchema);

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;