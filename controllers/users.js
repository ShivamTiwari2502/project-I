const User = require("../models/user.js");

module.exports.signupPage = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.createUser = async(req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginPage = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.checkLogin = async(req,res)=>{
    req.flash("success", "Welcome back to wanderlust!");
    // after logging in, the page goes to under defined path before it was going to listings everytime
    // here OR operator is used for convenience
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
    // res.redirect("/listings");
    
    // we can use if-else instead of OR operator usage
    // if(res.locals.redirectUrl){
    //     res.redirect(res.locals.redirect);
    // }
    // else{
    //     res.redirect("/listings");
    // }
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "successfully logged out !");
        res.redirect("/listings");
    });

}