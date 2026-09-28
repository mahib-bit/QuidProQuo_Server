//===============================Imports================================

const Item = require('../models/Item');



//=============================Create Item===============================

const createItem = async (req, res, next) => {

    try {

        const item = new Item(req.body); 

        await item.save();

        res.status(201).json(item);

    } catch (error) {

        next(error);

    }

};

//=============================Get All Items============================

const getItems = async (req, res, next) => {

    try {

        const items = await Item.find()
            .populate('owner');

        res.json(items);

    } catch (error) {

        next(error);

    }

};

//=============================Get Item By ID===========================

const getItemById = async (req, res, next) => {

    try {

        const item = await Item.findById(req.params.id)
            .populate('owner');

        if (!item) {

            return res.status(404).json({
                message: 'Item not found'
            });

        }

        res.json(item);

    } catch (error) {

        next(error);

    }

};

//=============================Update Item==============================


const updateItem = async (req, res, next) =>{

    try{
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('owner');
        
        if(!item) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(item);
    }
    catch(error){
        next(error);
    }
};

//=========================Delete Item=========================
const deleteItem = async (req, res) => {

    try {

        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        res.json({
            message: 'Item deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: 'Failed to delete item',
            error: error.message
        });

    }

};

//=============================Export===================================

module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
};