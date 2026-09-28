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
        required: true,
        trim: true
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
        required: true,
        trim: true
    },


    //=============================Estimated Value=======================

    estimatedValue: {
        type: Number,
        required: true,
        min: 0
    },


    //=============================Images================================

    images: {
        type: [String],
        default: []
    },


    //=============================Status================================

    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }

});


//=============================Item Model===============================

const Item = mongoose.model('Item', itemSchema);


//=============================Export===================================

module.exports = Item;