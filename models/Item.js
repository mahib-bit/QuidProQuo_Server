//===============================Imports================================

const mongoose = require('mongoose');



//=============================Item Schema==============================

const itemSchema = new mongoose.Schema({

    //=============================Owner================================

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


    //=============================Name=================================

    name: {
        type: String,
        required: true,
        trim: true
    },


    //=============================Category==============================

    category: {
        type: String,
        enum: [
            'Electronics',
            'Clothing & Apparel',
            'Home & Furniture',
            'Health & Beauty',
            'Tools & Hardware',
            'Groceries & Food',
            'Office & Stationery',
            'Automotive',
            'Toys & Sports',
            'Books & Media',
            'Other'
        ],
        default: 'Other',
        required: true,
    },


    //=============================Description===========================

    description: {
        type: String,
        required: true,
        trim: true
    },


    //=============================Condition=============================

    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Poor'],
        default: 'Good'
    },


    //=============================Location=======================

    location: {
        type: String,
        required: true,
    },


    //=============================Purchase Date=========================

    purchaseDate: {
        type: Date
    },


    //=============================Purchase Price========================

    purchasePrice: {
        type: Number,
        min: 0
    },


    //=============================Images================================

    images: {
        type: [String],
        default: []
    },


    //=============================Notes=================================

    notes: {
        type: String,
        trim: true
    },


    //=============================Status================================

    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }

}, { timestamps: true });


//=============================Item Model===============================

const Item = mongoose.model('Item', itemSchema);


//=============================Export===================================

module.exports = Item;