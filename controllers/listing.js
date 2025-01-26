const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
     const allListings = await Listing.find({});
     res.render("listings/index", { allListings });
 };

 module.exports.renderNewForm = (req, res) => {
     res.render("listings/new");
 }


 module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image ={url,filename};
     await newListing.save();
     req.flash("success", "Successfully created a new listing!");
     res.redirect("/listings");
 }

 module.exports.showListing =async (req, res, next) => {
     const listing = await Listing.findById(req.params.id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
     if (!listing) {
         throw new ExpressError("Listing not found!", 404);
     }
     res.render("listings/show", { listing });
 }

 module.exports.editListing =async (req, res) => {
     const listing = await Listing.findById(req.params.id);
     res.render("listings/edit", { listing });
 };


 module.exports.updateListing =async (req, res) => {
     if (!req.body.listing) {
         throw new ExpressError(400, "Invalid Listing Data");
     }
    let listing =  await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
     let filename = req.file.filename;
     listing.image ={url,filename};
     await listing.save();
    }
     req.flash("success", "Successfully updated the listing!");
     res.redirect(`/listings/${req.params.id}`);
 }

 module.exports.deleteListing =async (req, res) => {
     await Listing.findByIdAndDelete(req.params.id);
     req.flash("success", "Successfully deleted the listing!");
     res.redirect("/listings");
 }