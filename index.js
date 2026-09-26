//===============================Imports================================

const express = require('express');

const mongoose = require('mongoose');

const User = require('./models/Users')

//=============================Express App==============================

const app = express();

//=============================Middleware==============================

app.use(express.json());

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

//==============================User Routes=================================

app.get('/', (req, res) => {
    res.send('Quid Pro Quo Server is running!');
});

app.post('/users', async (req, res) => {
    const user = new User(req.body);

    await user.save();

    res.json(user);
});

//=============================Start Server==============================

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

