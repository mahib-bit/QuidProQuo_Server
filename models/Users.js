const mongoose = require('mongoose');

//==========================User Schema=========================

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    photo: {
        type: String,
        default: ''
    }
});

//===========================User Model=========================

const User = mongoose.model('User', userSchema);

module.exports = User;