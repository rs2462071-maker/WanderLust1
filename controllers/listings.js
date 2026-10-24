
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// ================= ALL LISTINGS =================

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// ================= NEW LISTING FORM =================

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// ================= CREATE LISTING =================

module.exports.createListing = async (req, res) => {
    console.log("REQ.FILE:", req.file);
    console.log("REQ.BODY:", req.body);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // IMAGE UPLOAD
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    // LOCATION COORDINATES
    const location =
        `${req.body.listing.location}, ${req.body.listing.country}`;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
            {
                headers: {
                    "User-Agent": "Airbnb-Clone-Project",
                },
            }
        );

        if (response.ok) {
            const data = await response.json();

            if (data.length > 0) {
                newListing.geometry = {
                    type: "Point",
                    coordinates: [
                        parseFloat(data[0].lon),
                        parseFloat(data[0].lat),
                    ],
                };
            } else {
                console.log("Location not found:", location);
            }
        } else {
            console.log("Geocoding HTTP status:", response.status);
        }
    } catch (error) {
        console.log("Geocoding error:", error.message);
    }

    // SAVE LISTING
    await newListing.save();

    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
};

// ================= SHOW LISTING =================

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        });

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/show.ejs", { listing });
};

// ================= EDIT FORM =================

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/edit.ejs", { listing });
};

// ================= UPDATE LISTING =================

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    // UPDATE NORMAL FIELDS
    if (req.body.listing) {
        Object.assign(listing, req.body.listing);
    }

    // UPDATE IMAGE
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    // UPDATE LOCATION COORDINATES
    if (
        req.body.listing?.location &&
        req.body.listing?.country
    ) {
        const location =
            `${req.body.listing.location}, ${req.body.listing.country}`;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
                {
                    headers: {
                        "User-Agent": "Airbnb-Clone-Project",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data.length > 0) {
                    listing.geometry = {
                        type: "Point",
                        coordinates: [
                            parseFloat(data[0].lon),
                            parseFloat(data[0].lat),
                        ],
                    };
                } else {
                    console.log("Location not found:", location);
                }
            } else {
                console.log("Geocoding HTTP status:", response.status);
            }
        } catch (error) {
            console.log("Update geocoding error:", error.message);
        }
    }

    // SAVE UPDATED LISTING
    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// ================= DELETE LISTING =================

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found!");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
