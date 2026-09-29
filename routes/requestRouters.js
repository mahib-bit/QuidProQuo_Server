//===============================Imports================================

const express = require('express');

const {
    createRequest,
    getRequests,
    getRequestsById,
    deleteRequest,
    acceptRequest,
    rejectRequest
} = require('../controllers/requestController');



//=============================Router===================================

const router = express.Router();



//=============================Request Routes===========================

router.post('/', createRequest);

router.get('/', getRequests);

router.get('/:id', getRequestsById);

router.delete('/:id', deleteRequest);

router.patch('/:id/accept', acceptRequest);

router.patch('/:id/reject', rejectRequest);

//=============================Export Router============================

module.exports = router;