const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require("../models/listing.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New Listing Form
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// Create Listing
router.post("/", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}));

// Show Listing
router.get("/:id", wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        throw new ExpressError("Listing not found!", 404);
    }
    res.render("listings/show", { listing });
}));

// Edit Listing Form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { listing });
}));

// Update Listing
router.put("/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${req.params.id}`);
}));

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;
