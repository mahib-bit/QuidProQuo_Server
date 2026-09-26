//===============================Imports================================

const express = require('express');

const User = require('./models/User');

const connectDB = require('./config/db');


//=============================Express App==============================

const app = express();


//=============================Middleware==============================

app.use(express.json());


//=================================Port=================================

const port = 3000;


//==========================MongoDB Connection==============================

connectDB();


//================================Routes=================================

app.get('/', (req, res) => {

    res.send('Quid Pro Quo Server is running!');

});


//=============================User Routes==============================

app.post('/users', async (req, res) => {

    try {

        const user = new User(req.body);

        await user.save();

        res.status(201).json(user);

    } catch (error) {

        res.status(400).json({
            message: 'Failed to create user',
            error: error.message
        });

    }

});


//=============================Start Server==============================

app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});