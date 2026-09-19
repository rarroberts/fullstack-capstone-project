const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

dotenv.config();

const logger = pino();

const JWT_SECRET = process.env.JWT_SECRET;


// REGISTER
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection("users");

        // Task 3: Check for existing email
        const existingEmail = await collection.findOne({
            email: req.body.email
        });

        if (existingEmail) {
            return res.status(400).send('Email already exists');
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // Task 4: Save user details
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT authentication
        const payload = {
            user: {
                id: newUser.insertedId.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');

        return res.json({
            authtoken,
            email
        });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to giftsdb through connectToDatabase
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection("users");

        // Task 3: Check for user credentials in database
        const theUser = await collection.findOne({
            email: req.body.email
        });

        if (theUser) {

            // Task 4: Check if password matches encrypted password
            const result = await bcryptjs.compare(
                req.body.password,
                theUser.password
            );

            if (!result) {
                logger.error('Passwords do not match');

                return res.status(404).json({
                    error: 'Wrong pasword'
                });
            }

            // Task 5: Fetch user details
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Create JWT authentication
            const payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const authtoken = jwt.sign(payload, JWT_SECRET);

            return res.json({
                authtoken,
                userName,
                userEmail
            });

        } else {

            // Task 7: User not found
            logger.error('User not found');

            return res.status(404).json({
                error: 'User not found'
            });
        }

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


module.exports = router;
