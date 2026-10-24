const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");


// ================= CREATE REVIEW =================

module.exports.createReview = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(
            404,
            "Listing not found!"
        );
    }

    const review = new Review(
        req.body.review
    );

    // Logged-in user becomes author
    review.author = req.user._id;

    await review.save();

    // Add review to listing
    listing.reviews.push(review._id);

    await listing.save();

    req.flash(
        "success",
        "Review added successfully!"
    );

    res.redirect(`/listings/${id}`);
};


// ================= DELETE REVIEW =================

module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    // Remove review from listing
    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    // Delete review
    const deletedReview =
        await Review.findByIdAndDelete(
            reviewId
        );

    if (!deletedReview) {
        throw new ExpressError(
            404,
            "Review not found!"
        );
    }

    req.flash(
        "success",
        "Review deleted successfully!"
    );

    res.redirect(`/listings/${id}`);
};