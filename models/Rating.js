//===============================Imports================================

const mongoose = require('mongoose');



//=============================Rating Schema=============================

const ratingSchema = new mongoose.Schema({

    //=============================Agreement============================

    agreement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agreement',
        required: true
    },


    //=============================Rated By=============================

    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


    //=============================Rated User===========================

    ratedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


    //=============================Score================================

    score: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },


    //=============================Comment==============================

    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }

}, { timestamps: true });



//=========================Unique Rating Index==========================

ratingSchema.index(
    { agreement: 1, ratedBy: 1 },
    { unique: true }
);



//=============================Rating Model=============================

const Rating = mongoose.model('Rating', ratingSchema);



//=============================Export===================================

module.exports = Rating;