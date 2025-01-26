const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isOwner,isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
// Index Route
.get( wrapAsync(listingController.index))
// Create Listing
.post(
     isLoggedIn,
     upload.single('listing[image]'), //multer will process
      wrapAsync(listingController.createListing));


// New Listing Form
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
// Show Listing
.get( wrapAsync(listingController.showListing))
// Update Listing
.put(isLoggedIn,isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
// Delete Listing
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn ,isOwner,wrapAsync(listingController.editListing));
module.exports = router;
