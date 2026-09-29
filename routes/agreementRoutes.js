const express = require('express');
const router = express.Router();

const {
    getAgreements,
    getAgreementById,
    returnItem
} = require('../controllers/agreementControllers');

router.get('/', getAgreements);
router.get('/:id', getAgreementById);
router.patch('/:id/return', returnItem);

module.exports = router;
