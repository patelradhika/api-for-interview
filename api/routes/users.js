const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CONFIG = require("../../config.json");
const TOKEN_SECRET = CONFIG.token.secret;
const TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);

const User = require("../models/user");

router.post("/", (req, res) => {
    // Check if User with that username already exists or not
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.status(500).json({
                message: "Internal Server Error.",
            });

            return;
        }

        // If User with that username exists, throw error (Conflict)
        if (user) {
            res.status(409).json({
                message: `User with the username ${req.body.username} already exists.`,
            });

            return;
        }

        // If User with that username does not exists, create new entry in DB for that user
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);

        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashPassword,
        });

        User.create(user, (err, user) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error.",
                });

                throw err;
            } else {
                // Return User data after successful DB entry creation
                res.status(200).json({
                    message: `User ${user.username} created successfully.`,
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        createdAt: user.createdAt,
                    },
                });
            }
        });
    });
});

router.post("/login", (req, res) => {
    // Check if User with that username exists or not
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.status(500).json({
                message: "Internal Server Error.",
            });

            return;
        }

        // If no User is found with that username, throw error (Unauthorized)
        if (!user) {
            res.status(401).json({
                message: `User with username ${req.body.username} not found.`,
            });

            return;
        }

        // If User found, check password and throw error if incorrect (Unauthorized)
        const result = bcrypt.compareSync(req.body.password, user.password);
        if (!result) {
            res.status(401).json({
                message: "User Authentication failed due to wrong password.",
            });

            return;
        }

        // User is authenticated, create token and send to the user
        const token = jwt.sign({ username: user.username }, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRES,
        });

        res.status(200).json({
            message: "Login successful.",
            token: token,
        });
    });
});

module.exports = router;
