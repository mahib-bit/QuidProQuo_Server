const User = require('../models/Users');
const Agreement = require('../models/Agreement');
const Rating = require('../models/Rating');

//=========================Get Trust Profile=========================

const getTrustProfile = async (req, res, next) => {

    try {

        const userId = req.params.userId;

        //=========================Check User=========================

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        //=========================Get Agreements=========================

        const agreements = await Agreement.find({
            $or: [
                { owner: userId },
                { borrower: userId }
            ]
        });

        //=========================Agreement Statistics=========================

        const totalAgreements = agreements.length;

        const completedAgreements = agreements.filter(
            agreement => agreement.status === 'returned'
        ).length;

        const overdueAgreements = agreements.filter(
            agreement => agreement.status === 'overdue'
        ).length;

        //=========================Returned On Time=========================

        const returnedOnTime = agreements.filter(agreement => {

            if (
                agreement.status !== 'returned' ||
                !agreement.returnedAt ||
                !agreement.endDate
            ) {
                return false;
            }

            return agreement.returnedAt <= agreement.endDate;

        }).length;

        //=========================Returned Late=========================

        const returnedLate = agreements.filter(agreement => {

            if (
                agreement.status !== 'returned' ||
                !agreement.returnedAt ||
                !agreement.endDate
            ) {
                return false;
            }

            return agreement.returnedAt > agreement.endDate;

        }).length;

        //=========================Get Ratings=========================

        const ratings = await Rating.find({
            ratedUser: userId
        });

        const totalRatings = ratings.length;

        //=========================Calculate Average Rating=========================

        let averageRating = 0;

        if (totalRatings > 0) {

            const totalScore = ratings.reduce(
                (sum, rating) => sum + rating.score,
                0
            );

            averageRating = totalScore / totalRatings;

            // Keep only 2 decimal places
            averageRating = Number(averageRating.toFixed(2));
        }

        //=========================Rating Breakdown=========================

        const ratingBreakdown = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        ratings.forEach(rating => {
            ratingBreakdown[rating.score]++;
        });

        //=========================Trust Level=========================

        let trustLevel = 'New';

        if (completedAgreements >= 10) {

            trustLevel = 'Experienced';

        } else if (completedAgreements >= 5) {

            trustLevel = 'Established';
        }

        //=========================Send Response=========================

        res.json({

            user: {
                id: user._id,
                name: user.name,
                photo: user.photo
            },

            trust: {

                level: trustLevel,

                statistics: {

                    totalAgreements,
                    completedAgreements,
                    overdueAgreements,
                    returnedOnTime,
                    returnedLate

                },

                ratings: {

                    totalRatings,
                    averageRating,
                    breakdown: ratingBreakdown

                }

            }

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getTrustProfile
};