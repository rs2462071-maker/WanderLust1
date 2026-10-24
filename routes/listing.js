const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");

const { storage } = require("../utils/cloudConfig.js");

const upload = multer({ storage });

const {
    isLoggedIn,
    isOwner
} = require("../utils/middleware.js");


// ================= ALL LISTINGS =================

router.route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );


// ================= NEW LISTING =================

router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// ================= SINGLE LISTING =================

router.route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )

    .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        wrapAsync(listingController.updateListing)
    )

    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );
// ================= EDIT FORM =================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;