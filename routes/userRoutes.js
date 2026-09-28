//===============================Imports================================

const express = require('express');

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userControllers');


//===============================Router=================================

const router = express.Router();


//=============================User Routes==============================

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);


//=============================Export Router============================

module.exports = router;