const mongoose = require('mongoose');

const mandiPriceSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true,
        trim: true
    },
    mandiName: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    minPrice: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: true
    },
    modalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const MandiPrice = mongoose.model('MandiPrice', mandiPriceSchema);

module.exports = MandiPrice;
