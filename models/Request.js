//===============================Imports================================

const mongoose = require('mongoose');



//=============================Request Schema===========================

const requestSchema = new mongoose.Schema({

    //=============================Requester============================

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


    //=============================Item=================================

    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },


    //=============================Owner================================

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


    //=============================Proposed Start=======================

    proposedStart: {
        type: Date,
        required: true
    },


    //=============================Proposed End=========================

    proposedEnd: {
        type: Date,
        required: true
    },


    //=============================Agreement Type=======================

    agreementType: {
        type: String,
        enum: ['lending', 'itemExchange', 'serviceExchange'],
        required: true
    },


    //=============================Message===============================

    message: {
        type: String,
        trim: true
    },


    //=============================Status===============================

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }

}, { timestamps: true });



//=============================Request Model============================

const Request = mongoose.model('Request', requestSchema);



//=============================Export===================================

module.exports = Request;