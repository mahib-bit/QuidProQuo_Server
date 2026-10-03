//===============================Imports================================

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('./config/firebaseAdmin');
const authMiddleware = require('./middleware/authMiddleware');


const userRoutes = require('./routes/userRoutes');

const itemRoutes = require('./routes/itemRouters');

const requestRoutes = require('./routes/requestRouters');

const agreementRoutes = require('./routes/agreementRoutes');

const ratingRoutes = require('./routes/ratingRouter');

const trustRoutes = require('./routes/trustRouters');


const errorMiddleware = require('./middleware/errorMiddleware');


//=============================Express App==============================

const app = express();

app.use(cors());

//=============================Middleware===============================

app.use(express.json());

//=========================Test Protected Route=========================

app.get('/protected', authMiddleware, (req, res) => {

    res.json({
        message: 'You are authenticated!',
        user: req.user
    });

});

//=================================Port=================================

const port = 3000;



//==========================MongoDB Connection==========================

connectDB();



//================================Routes=================================

app.get('/', (req, res) => {

    res.send('Quid Pro Quo Server is running!');

});



//=============================User Routes==============================

app.use('/users', userRoutes);


//=============================Item Routes==============================

app.use('/items', itemRoutes);

//=============================Request Routes==========================

app.use('/requests', requestRoutes);

//=============================Agreement Routes==========================

app.use('/agreements', agreementRoutes);

//=============================Rating Routes==========================

app.use('/ratings', ratingRoutes);

//=============================Trust Routes==========================


app.use('/trust', trustRoutes);

//=============================Error Middleware==========================

app.use(errorMiddleware);


//=============================Start Server==============================

app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});