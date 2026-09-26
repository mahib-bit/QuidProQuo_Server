const mongoose = require('mongoose')

//==========================MongoDB Connection============================

const connectDB = async () => {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/quid-pro-quo')
        console.log('MongoDB connected Successfully!');
    }
    catch (error) {
        console.log('MongoDB connection failed:', error);
    };
}
