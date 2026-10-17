const Agreement = require('../models/Agreement');
const Item = require('../models/Item');

const User = require('../models/Users')

// //=========================Get Agreements (with filters)=========================

// const getAgreements = async (req, res, next) => {

//     try {

//         const filter = {};

//         if (req.query.status) filter.status = req.query.status;
//         if (req.query.borrower) filter.borrower = req.query.borrower;
//         if (req.query.owner) filter.owner = req.query.owner;

//         const agreements = await Agreement.find(filter)
//             .populate('item', 'name')
//             .populate('owner', 'name email')
//             .populate('borrower', 'name email');

//         res.json(agreements);

//     } catch (error) {

//         next(error);

//     }

// };


// ========================= Get My Agreements =========================
const getMyAgreements = async (req, res, next) => {
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

        // Find agreements where the user is the owner or borrower
        const agreements = await Agreement.find({
            $or: [
                { owner: user._id },
                { borrower: user._id }
            ]
        })
            .populate('item')
            .populate('owner', 'name email')
            .populate('borrower', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(agreements);
    } catch (error) {
        next(error);
    }
};


//=========================Get Single Agreement=========================
const getAgreementById = async (req, res, next) => {

    try {

        const agreement = await Agreement.findById(req.params.id)
            .populate('item', 'name')
            .populate('owner', 'name email')
            .populate('borrower', 'name email');

        if (!agreement) {
            return res.status(404).json({
                message: 'Agreement not found'
            });
        }

        res.json(agreement);

    } catch (error) {

        next(error);

    }

};

//=========================Return Item=========================

const returnItem = async (req, res, next) => {

    try {

        const agreement = await Agreement.findById(req.params.id);

        if (!agreement) {
            return res.status(404).json({
                message: 'Agreement not found'
            });
        }

        if (agreement.status === 'returned') {
            return res.status(400).json({
                message: 'Item already returned'
            });
        }
        if (agreement.status !== 'active' && agreement.status !== 'overdue') {
            return res.status(400).json({
                message: `Agreement cannot be returned because it is ${agreement.status}`
            });
        }

        agreement.status = 'returned';
        agreement.returnedAt = new Date();
        await agreement.save();

        await Item.findByIdAndUpdate(agreement.item, { status: 'available' });

        res.json({
            message: 'Item marked as returned',
            agreement
        });

    } catch (error) {

        next(error)
    }

};

module.exports = {
    
    getMyAgreements,
    getAgreementById,
    returnItem,
};
