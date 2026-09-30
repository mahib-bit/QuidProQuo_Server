const express = require('express');

const {
    getTrustProfile
} = require('../controllers/trustController');

const router = express.Router();

//=========================Get Trust Profile=========================

router.get('/:userId', getTrustProfile);

module.exports = router;