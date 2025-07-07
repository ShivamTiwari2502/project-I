const Listing = require("./models/listing.js");
const Reviews = require("./models/reviews.js");
const expressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema} = require('./validSchema.js');

module.exports.isLoggedIn = (req, res, next)=>{
     if(!req.isAuthenticated()){
        // saving redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be loggin in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "you don't have permissions to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    console.log(reviewId);
    let review = await Reviews.findById(reviewId);
    console.log(review);
    if(! review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// to validate the review schema from the server calls
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
};

// to validate the review schema from the server calls
module.exports.validateReviews = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else{
        next();
    }
};