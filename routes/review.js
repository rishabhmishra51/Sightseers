const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Create Review
router.post("/", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Successfully added a review!");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
