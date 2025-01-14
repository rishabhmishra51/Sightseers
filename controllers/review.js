const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
     const listing = await Listing.findById(req.params.id);
     const review = new Review(req.body.review);
     review.author = req.user._id;
     console.log(review);
     
     listing.reviews.push(review);
     await review.save();
     await listing.save();
     req.flash("success", "Successfully added a review!");
     res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview =async (req, res) => {
     const { id, reviewId } = req.params;
     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Successfully deleted the review!");
     res.redirect(`/listings/${id}`);
 }

