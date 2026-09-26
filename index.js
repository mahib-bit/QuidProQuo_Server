//===============================Imports================================

const express = require('express');

const mongoose = require('mongoose');

//=============================Express App==============================

const app = express();

//=================================Port=================================

const port = 3000;

//==========================MongoDB Connection==============================

mongoose.connect('mongodb://127.0.0.1:27017/quid-pro-quo')
    .then(() => {
        console.log('MongoDB connected Successfully!');
    })
    .catch((error) => {
        console.log('MongoDB connection failed:', error);
    });

//================================Routes=================================

app.get('/', (req, res) => {
    res.send('Quid Pro Quo Server is running!');
});

//=============================Start Server==============================

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

