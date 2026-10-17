//===============================Imports================================

const Request = require('../models/Request');

const Agreement = require('../models/Agreement');

const User = require('../models/Users')

const Item = require('../models/Item')


//=============================Create Request===========================


const createRequest = async (req, res, next) => {
    try {
        //=========================Find Item=========================

        const item = await Item.findById(req.body.item);

        if (!item) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        //=========================Find Requester=========================

        const user = await User.findOne({
            firebaseUid: req.user.uid
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        //=========================Check Item Owner=========================

        if (item.owner.toString() === user._id.toString()) {
            return res.status(400).json({
                message: 'You cannot send a request for your own item'
            });
        }

        //=========================Check Item Availability=========================

        if (item.status !== 'available') {
            return res.status(400).json({
                message: 'Item is currently unavailable'
            });
        }

        //=========================Validate Dates=========================

        const { proposedStart, proposedEnd, agreementType } = req.body;

        if (!proposedStart || !proposedEnd) {
            return res.status(400).json({
                message: 'Proposed start and end dates are required'
            });
        }

        const startDate = new Date(proposedStart);
        const endDate = new Date(proposedEnd);

        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())
        ) {
            return res.status(400).json({
                message: 'Invalid proposed dates'
            });
        }

        if (startDate > endDate) {
            return res.status(400).json({
                message: 'Start date cannot be after end date'
            });
        }

        //=========================Create Request=========================

        const request = new Request({
            item: item._id,
            requester: user._id,
            owner: item.owner,
            proposedStart: startDate,
            proposedEnd: endDate,
            agreementType: agreementType || 'lending',
            status: 'pending'
        });

        await request.save();

        //=========================Send Response=========================

        return res.status(201).json({
            message: 'Borrowing request created successfully',
            request
        });

    } catch (error) {
        next(error);
    }
};


//=========================Get Requests (with filters)=========================

// ========================= Get Requests =========================
const getRequests = async (req, res, next) => {
    try {
        const { status, owner, requester } = req.query;

        // ========================= Build Filter =========================
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (owner) {
            filter.owner = owner;
        }

        if (requester) {
            filter.requester = requester;
        }

        // ========================= Fetch Requests =========================
        const requests = await Request.find(filter)
            .populate('item')
            .populate('requester', 'name email')
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        // ========================= Send Response =========================
        res.status(200).json(requests);

    } catch (error) {
        next(error);
    }
};

//=========================Get My Requests=========================

const getMyRequests = async (req, res, next) => {
    try {
        // Find the logged-in user in MongoDB
        const user = await User.findOne({
            firebaseUid: req.user.uid
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Find requests created by this user
        const requests = await Request.find({
            requester: user._id
        })
            .populate('item')
            .populate('owner', 'name email')
            .populate('requester', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json(requests);

    } catch (error) {
        console.error('getMyRequests error:', error);
        next(error);
    }
};


 // ========================= Get Incoming Requests =========================
const getIncomingRequests = async (req, res, next) => {
    try {
        // Find the logged-in user's MongoDB record
        const user = await User.findOne({
            firebaseUid: req.user.uid
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Find requests for items owned by the logged-in user
        const requests = await Request.find({
            owner: user._id
        })
            .populate('item')
            .populate('requester', 'name email')
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};


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
    getIncomingRequests,
    deleteRequest,
    acceptRequest,
    rejectRequest,
    getMyRequests
};