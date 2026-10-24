const Listing = require("../models/listing");
const Review = require("../models/review");


// ================= IS LOGGED IN =================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in!"
        );

        return res.redirect("/login");
    }

    next();
};


// ================= SAVE REDIRECT URL =================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl =
            req.session.redirectUrl;

        delete req.session.redirectUrl;
    }

    next();
};


// ================= LISTING OWNER =================

module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {

        req.flash(
            "error",
            "Listing not found!"
        );

        return res.redirect("/listings");
    }

    if (
        !listing.owner ||
        !listing.owner.equals(req.user._id)
    ) {

        req.flash(
            "error",
            "You don't have permission!"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};


// ================= REVIEW AUTHOR =================

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {

        req.flash(
            "error",
            "Review not found!"
        );

        return res.redirect(`/listings/${id}`);
    }

    if (
        !review.author ||
        !review.author.equals(req.user._id)
    ) {

        req.flash(
            "error",
            "You don't have permission to delete this review!"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};