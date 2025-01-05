const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isOwner,isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
// Index Route
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router.get("/new", isLoggedIn,listingController.renderNewForm);


// Create Listing
router.post("/",isLoggedIn, wrapAsync(listingController.createListing));

// Show Listing
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn ,isOwner,wrapAsync(listingController.editListing));

// Update Listing
router.put("/:id", isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

// Delete Listing
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
