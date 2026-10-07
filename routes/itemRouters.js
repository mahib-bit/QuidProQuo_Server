//===============================Imports================================

const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
} = require('../controllers/itemController');



//=============================Router===================================

const router = express.Router();



//=============================Item Routes==============================

router.post('/', authMiddleware , createItem);

router.get('/', getItems);

router.get('/:id', getItemById);

router.put('/:id', updateItem);

router.delete('/:id', deleteItem);

//=============================Export Router============================

module.exports = router;