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

//=========================Get Items (with filters)=========================

const getItems = async (req, res, next) => {

    try {
        const filter = {};

        //=============================Filters=============================

        if (req.query.category) {

            filter.category = req.query.category;

        }

        if (req.query.status) {

            filter.status = req.query.status;

        }

        if (req.query.owner) {

            filter.owner = req.query.owner;

        }

        if (req.query.search) {

            filter.name = {
                $regex: req.query.search,
                $options: 'i'
            };

        }

        //=============================Query===============================

        let query = Item.find(filter)
            .populate('owner');


        //=============================Sorting=============================

        if (req.query.sort === 'latest') {

            query = query.sort({ createdAt: -1 });

        }

        if (req.query.sort === 'oldest') {

            query = query.sort({ createdAt: 1 });

        }


        //=============================Limit===============================

        if (req.query.limit) {

            query = query.limit(parseInt(req.query.limit));

        }


        //=============================Execute Query=======================

        const items = await query;

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


const updateItem = async (req, res, next) => {

    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('owner');

        if (!item) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(item);
    }
    catch (error) {
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