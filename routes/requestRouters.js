//===============================Imports================================

const express = require('express');

const {
    createRequest,
    getRequests,
    getRequestsByID,
    deleteRequest
} = require('../controllers/requestController');



//=============================Router===================================

const router = express.Router();



//=============================Request Routes===========================

router.post('/', createRequest);

router.get('/', getRequests);

router.get('/:id', getRequestsByID);

router.delete('/:id', deleteRequest);

//=============================Export Router============================

module.exports = router;