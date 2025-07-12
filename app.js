if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
    }
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const ExpressError = require('./utils/ExpressError.js');

// this is the link to connect this server to DB that is on mongoATLAS online
const dbUrl = process.env.MONGO_URL;

// this is the link to coonect this server with local mongo
// const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';

// connection to particular DB of mongoDB using mongoose 
async function main() {
    try{
        await mongoose.connect(dbUrl);
    }
    catch(error){
        console.log(error.message);
    }
}

main().then(res=>{console.log("database connected to", dbUrl)})
.catch(err=>{console.log(err)}); 

// multiple middlewares are used
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
// express session is also a type of middleware

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
        secret : process.env.secret,
    },
    touchAfter : 24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongo session store", err);
});

app.use(expressSession({
    store,
    secret : process.env.secret, 
    resave : false,
    saveUninitialized : true,
    // different states of cookies can be written
    cookie : {
        // only one of the cookie stances suggested to be used
        maxAge:  Date.now() * 7 * 24 * 60 * 60 * 1000,
        expires :7* 24 * 60* 60 * 10,
        httpOnly: true,
    }
}));
app.use(flash());

//-------------authentication part --------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// --------------------------------------------------

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.reviewAdded = req.flash("reviewAdded");
    res.locals.reviewDeleted = req.flash("reviewDeleted");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next();
})

// different routes goes differnet ways
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// different routes connected are used differently
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// error handling for all the routes including the routes not mentioned
// wrap async is applied
app.all(/.*/,(req, res, next)=>{
    next(new ExpressError(404, "page not found"));
})

// eror handling
app.use((err, req, res, next)=>{
    let { statusCode=500, message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message});
})

let port = 3000;
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${port}`);
}) 