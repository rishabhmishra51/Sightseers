const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isOwner,isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
const { createReview } = require("../controllers/review.js");
// Create Review
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));

// Delete Review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
