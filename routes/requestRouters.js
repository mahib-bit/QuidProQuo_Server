//===============================Imports================================

const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const {
    createRequest,
    getRequests,
    getIncomingRequests,
    deleteRequest,
    acceptRequest,
    rejectRequest,
    getMyRequests
} = require('../controllers/requestController');



//=============================Router===================================

const router = express.Router();



//=============================Request Routes===========================

router.post('/', authMiddleware, createRequest);

router.get('/',authMiddleware, getRequests);

router.get('/my', authMiddleware, getMyRequests);

router.get('/incoming', authMiddleware, getIncomingRequests);

router.delete('/:id', deleteRequest);

router.patch('/:id/accept', acceptRequest);

router.patch('/:id/reject', rejectRequest);

//=============================Export Router============================

module.exports = router;