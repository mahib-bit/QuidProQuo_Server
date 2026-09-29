//===============================Imports================================

const Request = require('../models/Request');



//=============================Create Request===========================

const createRequest = async (req, res, next) => {

    try {

        const request = new Request(req.body);

        await request.save();

        res.status(201).json(request);

    } catch (error) {

        next(error);

    }

};



//=============================Export===================================

module.exports = {
    createRequest
};