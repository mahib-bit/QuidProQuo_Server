//===============================Imports================================

const express = require('express');

const {
    createUser,
    getCurrentUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userControllers');

const authMiddleware = require('../middleware/authMiddleware');


//===============================Router=================================

const router = express.Router();


//=============================User Routes==============================

router.post('/',authMiddleware, createUser);

router.get('/', getUsers);

//=========================Get Current User=========================

router.get('/me', authMiddleware, getCurrentUser);

router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


//=============================Export Router============================

module.exports = router;