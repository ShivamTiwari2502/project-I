const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReviews, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

// reviews route
    router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.postReviews));
        
// delete reviews route
    router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReviews);

module.exports = router;