//===============================Imports================================

const express = require('express');

const {
    createRequest
} = require('../controllers/requestController');



//=============================Router===================================

const router = express.Router();



//=============================Request Routes===========================

router.post('/', createRequest);



//=============================Export Router============================

module.exports = router;