const Rating = require('../models/Rating');
const Agreement = require('../models/Agreement');


//=========================Create Rating=========================

const createRating = async (req, res, next) => {

    try {

        //=========================Find Agreement=========================

        const agreement = await Agreement.findById(req.body.agreement);

        if (!agreement) {

            return res.status(404).json({
                message: 'Agreement not found'
            });

        }


        //=========================Check Agreement Status=========================

        if (agreement.status !== 'returned') {

            return res.status(400).json({
                message: 'You can only rate a completed agreement'
            });

        }


        //=========================Prevent Self Rating=========================

        if (req.body.ratedBy === req.body.ratedUser) {

            return res.status(400).json({
                message: 'You cannot rate yourself'
            });

        }


        //=========================Check Rated By=========================

        if (
            req.body.ratedBy !== agreement.owner.toString() &&
            req.body.ratedBy !== agreement.borrower.toString()
        ) {

            return res.status(403).json({
                message: 'You were not part of this agreement'
            });

        }


        //=========================Check Rated User=========================

        const isValidRatedUser =

            (
                req.body.ratedBy === agreement.owner.toString() &&
                req.body.ratedUser === agreement.borrower.toString()
            )

            ||

            (
                req.body.ratedBy === agreement.borrower.toString() &&
                req.body.ratedUser === agreement.owner.toString()
            );


        if (!isValidRatedUser) {

            return res.status(400).json({
                message: 'You can only rate the other participant'
            });

        }


        //=========================Check Existing Rating=========================

        const existingRating = await Rating.findOne({

            agreement: req.body.agreement,

            ratedBy: req.body.ratedBy

        });


        if (existingRating) {

            return res.status(400).json({
                message: 'You have already rated this agreement'
            });

        }


        //=========================Create Rating=========================

        const rating = new Rating(req.body);

        await rating.save();


        //=========================Response=========================

        res.status(201).json(rating);

    } catch (error) {

        next(error);

    }

};


//=========================Get Ratings For a User=========================

const getRatingsForUser = async (req, res, next) => {

    try {

        const ratings = await Rating.find({
            ratedUser: req.params.userId
        })
            .populate('ratedBy', 'name')
            .populate('agreement');

        res.json(ratings);

    } catch (error) {

        next(error);

    }

};


module.exports = {

    createRating,
    getRatingsForUser

};