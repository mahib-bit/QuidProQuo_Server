const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({

    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },

    agreementType: {
        type: String,
        enum: ['lending', 'itemExchange', 'serviceExchange'],
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['active', 'overdue', 'returned', 'disputed'],
        default: 'active'
    }

}, { timestamps: true });

module.exports = mongoose.model('Agreement', agreementSchema);