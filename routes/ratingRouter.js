const express = require('express');

const {
    createRating,
    getRatingsForUser
} = require('../controllers/ratingController');

const router = express.Router();


//=========================Create Rating=========================

router.post('/', createRating);


//=========================Get Ratings For User=========================

router.get('/user/:userId', getRatingsForUser);


module.exports = router;