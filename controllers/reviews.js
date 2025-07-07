const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.postReviews = (async(req, res)=>{
            let listingId = req.params.id;
            let listing = await Listing.findById(req.params.id);
            let newReview = new Review(req.body.review);
            newReview.author = req.user._id;
            listing.reviews.push(newReview);
            console.log(newReview);

            await newReview.save();
            await listing.save();
            req.flash("success", "new review was added");
            console.log("review saved");
            res.redirect(`/listings/${listingId}`);
        })

module.exports.deleteReviews = async(req, res)=>{
            let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "review was deleted");
    res.redirect(`/listings/${id}`);
    }