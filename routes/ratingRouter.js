const express = require('express');
const router = express.Router();

const {
    createRating,
    getRatingsForUser
} = require('../controllers/ratingController');

router.post('/', createRating);
router.get('/user/:userId', getRatingsForUser);

module.exports = router;
