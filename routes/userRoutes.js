//===============================Imports================================

const express = require('express');

const User = require('../models/Users');



//=============================Router===================================

const router = express.Router();



//=============================Create User==============================

router.post('/users', async (req, res) => {

    try {

        const user = new User(req.body);

        await user.save();

        res.status(201).json(user);

    } catch (error) {

        res.status(400).json({
            message: 'Failed to create user',
            error: error.message
        });

    }

});



//=============================Get All Users============================

router.get('/users', async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message
        });

    }

});



//=============================Get User By ID===========================

router.get('/users/:id', async (req, res) => {

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

});



//=============================Update User==============================

router.put('/users/:id', async (req, res) => {

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

});



//=============================Delete User==============================

router.delete('/users/:id', async (req, res) => {

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

});



//=============================Export Router============================

module.exports = router;