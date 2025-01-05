const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isOwner,isLoggedIn } = require("../middleware.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New Listing Form
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new");
});


// Create Listing
router.post("/",isLoggedIn, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}));

// Show Listing
router.get("/:id", wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if (!listing) {
        throw new ExpressError("Listing not found!", 404);
    }
    res.render("listings/show", { listing });
}));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn ,isOwner,wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { listing });
}));

// Update Listing
router.put("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${req.params.id}`);
}));

// Delete Listing
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;
