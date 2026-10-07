//===============================Imports================================

const User = require('../models/Users');



//=============================Create User==============================

const createUser = async (req, res, next) => {

    try {

        const firebaseUid = req.user.uid;

        const { name, email, photo} = req.body;

        const existingUser = await User.findOne({ firebaseUid });

        if(existingUser) {
            return res.status(409).json({
                message: 'User already exists'
            })
        }

        const user = new User({
            firebaseUid,
            name,
            email,
            photo
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user
        });

    } 
    catch (error) {

        next(error);
    }

};

//=========================Get Current User=========================

const getCurrentUser = async (req, res, next) => {

    try {

        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid });

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        res.json(user);

    } catch (error) {

        next(error);

    }

};

//=============================Get All Users============================

const getUsers = async (req, res, next) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        next (error);

    }

};



//=============================Get User By ID===========================

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: 'Failed to fetch user',
            error: error.message
        });

    }

};



//=============================Update User==============================

const updateUser = async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        res.json(user);

    } catch (error) {

        res.status(400).json({
            message: 'Failed to update user',
            error: error.message
        });

    }

};



//=============================Delete User==============================

const deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: 'User not found'
            });

        }

        res.json({
            message: 'User deleted successfully',
            user
        });

    } catch (error) {

        res.status(500).json({
            message: 'Failed to delete user',
            error: error.message
        });

    }

};



//=============================Export Controllers=======================

module.exports = {
    createUser,
    getCurrentUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};