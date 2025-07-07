const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingConstroller = require("../controllers/listing.js");
const multer  = require('multer');
const {cloudinary} = require("../cloudConfig.js");
const {storage} = require('../cloudConfig.js');
// we use storage i.e. cloudinary db to save files instead of our local machine
const upload = multer({storage});

// new route
router.get("/new",isLoggedIn, listingConstroller.renderNewForm);

// Index route, create route
router.route("/")
    .get(wrapAsync(listingConstroller.index))
    .post(isLoggedIn,validateListing,upload.single("listings[image]"), wrapAsync(listingConstroller.createListing))
    
// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingConstroller.editListing))

// Show route
// update route
// error handling is done here
// delete route
// isOwner is a middleware which check for owner and current user
router.route("/:id")
    .get(wrapAsync(listingConstroller.showListing))
    .put(isLoggedIn, isOwner, upload.single("listings[image]"), validateListing, wrapAsync(listingConstroller.updateListing))
    .delete(isLoggedIn, isOwner ,wrapAsync(listingConstroller.deleteListing));
module.exports = router;