//===============================Imports================================

const Request = require('../models/Request');

const Agreement = require('../models/Agreement');

const Item = require('../models/Item')

//=============================Create Request===========================

const createRequest = async (req, res, next) => {

    try {

        const item = await Item.findById(req.body.item);

        if (req.body.requester === req.body.owner) {
            return res.status(400).json({
                message: 'You cannot send a request for your own item'
            });
        }

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        if (item.status !== 'available') {
            return res.status(400).json({
                message: 'Item is currently unavailable'
            });
        }

        if (new Date(req.body.proposedStart) > new Date(req.body.proposedEnd)) {
            return res.status(400).json({
                message: 'Start date cannot be after end date'
            });
        }
        const request = new Request(req.body);

        await request.save();

        res.status(201).json(request);

    } catch (error) {

        next(error);

    }

};

//=========================Get Requests (with filters)=========================

const getRequests = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        if (req.query.owner) filter.owner = req.query.owner;

        if (req.query.requester) filter.requester = req.query.requester;

        const requests = await Request.find(filter)
            .populate('item')
            .populate('requester', 'name email')
            .populate('owner', 'name email')
        res.json(requests)
    }
    catch (error) {
        next(error);
    }
}

//=========================Get Single Request=========================

const getRequestsById = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('item')
            .populate('requester', 'name email')
            .populate('owner', 'name email')

        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            })
        }
        res.json(request);
    }
    catch (error) {
        next(error);
    }
}

//=========================Accept Request=========================

const acceptRequest = async (req, res, next) => {

    try {

        const request = await Request.findById(req.params.id);

        if (!request) {

            return res.status(404).json({
                message: 'Request not found'
            });

        }

        if (request.status !== 'pending') {

            return res.status(400).json({
                message: 'Only pending requests can be accepted'
            });

        }

        request.status = 'accepted';

        await request.save();

        const agreement = new Agreement({
            item: request.item,
            owner: request.owner,
            borrower: request.requester,
            request: request._id,
            agreementType: request.agreementType,
            startDate: request.proposedStart,
            endDate: request.proposedEnd
        });
        await agreement.save();

        await Item.findByIdAndUpdate(request.item, { status: 'unavailable' });

        res.status(200).json({
            message: 'Request accepted, agreement created',
            request, agreement
        })

    } catch (error) {

        next(error);

    }

};

//=========================Reject Request=========================

const rejectRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                message: `Request is already ${request.status}`
            })
        }
        request.status = 'rejected';
        await request.save();
        res.json({
            message: 'Request rejected',
            request
        })
    }
    catch (error) {
        next(error)
    }
}

//=========================Delete Request=========================
const deleteRequest = async (req, res, next) => {

    try {

        const request = await Request.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }

        res.json({
            message: 'Request deleted successfully',
            request
        });

    } catch (error) {

        next(error)
    }

};

//=============================Export===================================

module.exports = {
    createRequest,
    getRequests,
    getRequestsById,
    deleteRequest,
    acceptRequest,
    rejectRequest
};