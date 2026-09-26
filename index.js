//===============================Imports================================

const express = require('express');

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');



//=============================Express App==============================

const app = express();



//=============================Middleware==============================

app.use(express.json());

app.use(userRoutes);



//=================================Port=================================

const port = 3000;



//==========================MongoDB Connection==========================

connectDB();



//================================Routes=================================

app.get('/', (req, res) => {

    res.send('Quid Pro Quo Server is running!');

});



//=============================Start Server==============================

app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});