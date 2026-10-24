const User = require("../models/user.js");


// ================= SIGNUP FORM =================

module.exports.renderSignupForm = (req, res) => {

    res.render("users/signup.ejs");
};


// ================= SIGNUP =================

module.exports.signup = async (req, res, next) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const newUser = new User({
            username,
            email
        });

        const registeredUser =
            await User.register(
                newUser,
                password
            );

        // Automatically login after signup
        req.login(
            registeredUser,
            (err) => {

                if (err) {
                    return next(err);
                }

                req.flash(
                    "success",
                    "Welcome to Wanderlust!"
                );

                res.redirect("/listings");
            }
        );

    } catch (err) {

        req.flash(
            "error",
            err.message
        );

        res.redirect("/signup");
    }
};


// ================= LOGIN FORM =================

module.exports.renderLoginForm = (req, res) => {

    res.render("users/login.ejs");
};


// ================= LOGIN =================

module.exports.login = (req, res) => {

    req.flash(
        "success",
        "Welcome back!"
    );

    const redirectUrl =
        res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};


// ================= LOGOUT =================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You have been logged out!"
        );

        res.redirect("/listings");
    });
};