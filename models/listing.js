
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
        },
        filename: {
            type: String,
            default: "default-image"
        }
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    // MAP LOCATION
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },

        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },

    // OWNER
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // REVIEWS
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
