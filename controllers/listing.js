const Listing = require("../models/listing.js");

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.index = async (req, res)=>{
    let allList = await Listing.find({});
    res.render("listings/index.ejs", {allList});
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate :{ path : "author",},})
    .populate("owner");
    if(! listing){
        req.flash("error", "requested listing does not exit or deleted");
        res.redirect("/listings");
    }
    else{
        res.render("listings/show.ejs", {listing});
    }
}

module.exports.createListing = async(req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listings);
    newlisting.owner = res.locals.currentUser._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "new listing was added");
    res.redirect("/listings");
}

module.exports.editListing = async(req, res)=>{
    let {id} = req.params;
    let  listing = await Listing.findById(id);
    if(! listing){
        req.flash("error", "requested listing does not exit or deleted");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listings});
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deleList = await Listing.findByIdAndDelete(id);
    // console.log('deleted');
    req.flash("deleted", "Listing was deleted");
    res.redirect("/listings");
}