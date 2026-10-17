const express = require('express');

const router = express.Router();

const {
    
    getMyAgreements,
    getAgreementById,
    returnItem
} = require('../controllers/agreementControllers');


const authMiddleware = require('../middleware/authMiddleware');

router.get('/my', authMiddleware, getMyAgreements);

router.get('/:id', getAgreementById);

router.patch('/:id/return', returnItem);

module.exports = router;
