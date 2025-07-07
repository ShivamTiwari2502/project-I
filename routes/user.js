const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const ExpressError = require('../utils/ExpressError.js');
const userController = require("../controllers/users.js");

// show signup page
// code for signup and auto login
router.route("/signup")
    .get(userController.signupPage)
    .post(wrapAsync(userController.createUser));


// show login page
router.route("/login")
    .get(userController.loginPage)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.checkLogin);

router.get("/logout", userController.logout )

module.exports = router;