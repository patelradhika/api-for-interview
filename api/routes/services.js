const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const tokenMiddelWare = require("../middleware/token");

const Agent = require("../models/agent");
const Client = require("../models/client");

router.post(
    "/agent-client",
    [
        // Check request data
        check(
            [
                "agent",
                "agent.name",
                "agent.address1",
                "agent.state",
                "agent.city",
                "agent.phoneNumber",
            ],
            "Agent name | address1 | state | city | phoneNumber missing"
        )
            .not()
            .isEmpty(),

        check(
            [
                "client",
                "client.name",
                "client.email",
                "client.phoneNumber",
                "client.totalBill",
            ],
            "Client name | email | phoneNumber | totalBill missing"
        )
            .not()
            .isEmpty(),

        check(
            ["agent.name", "agent.address1", "agent.state", "agent.city"],
            "Agent name | address1 | state | city must be a String"
        ).isString(),

        check("client.name", "Client name must be a String").isString(),

        check(
            "agent.phoneNumber",
            "Agent phoneNumber must be a Number"
        ).isInt(),

        check(
            ["client.phoneNumber", "client.totalBill"],
            "Client phoneNumber | totalBill must be a Number"
        ).isInt(),

        check("client.email", "Please check client email id").isEmail(),
    ],
    tokenMiddelWare,
    (req, res, next) => {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            // Check if already Agent is present or not
            Agent.findOne({ name: req.body.agent.name }, (err, agent) => {
                if (err) {
                    res.status(500).json({
                        message: "Internal Server Error.",
                    });

                    return;
                }

                if (agent) {
                    res.status(409).json({
                        message: `Agent ${agent.name} already exists.`,
                    });

                    return;
                }

                // Check if already Client is present or not
                Client.findOne(
                    { name: req.body.client.name },
                    (err, client) => {
                        if (err) {
                            res.status(500).json({
                                message: "Internal Server Error.",
                            });

                            return;
                        }

                        if (client) {
                            res.status(409).json({
                                message: `Client ${client.name} already exists.`,
                            });

                            return;
                        }

                        // Create new Agent and Client
                        var agent = new Agent({
                            name: req.body.agent.name,
                            address1: req.body.agent.address1,
                            address2: req.body.agent.address2 || "",
                            state: req.body.agent.state,
                            city: req.body.agent.city,
                            phoneNumber: req.body.agent.phoneNumber,
                        });

                        Agent.create(agent, (err, agent) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Internal Server Error.",
                                });

                                throw err;
                            } else {
                                var client = new Client({
                                    agentID: agent.id,
                                    agentName: agent.name,
                                    name: req.body.client.name,
                                    email: req.body.client.email,
                                    phoneNumber: req.body.client.phoneNumber,
                                    totalBill: req.body.client.totalBill,
                                });

                                Client.create(client, (err, client) => {
                                    if (err) {
                                        res.status(500).json({
                                            message: "Internal Server Error.",
                                        });

                                        return;
                                    } else {
                                        res.status(200).json({
                                            message:
                                                "Agent and Client created successfully.",
                                            data: {
                                                agent: {
                                                    name: agent.name,
                                                },
                                                client: {
                                                    name: client.name,
                                                    agent: agent.name,
                                                },
                                            },
                                        });
                                    }
                                });
                            }
                        });
                    }
                );
            });
        }
    }
);

router.put(
    "/client",
    [
        // Check request data
        check("name")
            .not()
            .isEmpty()
            .isString()
            .withMessage("Client name must be provided as a string."),

        check("email")
            .not()
            .isEmpty()
            .isEmail()
            .withMessage("Please check Client email id."),

        check("phoneNumber")
            .not()
            .isEmpty()
            .isInt()
            .withMessage("Client phoneNumber must be a number."),

        check("totalBill")
            .not()
            .isEmpty()
            .isInt()
            .withMessage("Client totalBill must be a number"),
    ],
    tokenMiddelWare,
    (req, res, next) => {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            // Check if Client is present or not
            Client.findOne({ name: req.body.name }, (err, client) => {
                if (err) {
                    res.status(500).json({
                        message: "Internal Server Error.",
                    });

                    return;
                }

                if (!client) {
                    res.status(401).json({
                        message: `Client ${req.body.name} not found.`,
                    });

                    return;
                } else {
                    // Update Client details and save
                    client.name = req.body.name;
                    client.email = req.body.email;
                    client.phoneNumber = req.body.phoneNumber;
                    client.totalBill = req.body.totalBill;
                    client.updatedAt = new Date();

                    client.save((err, client) => {
                        if (err) {
                            res.status(500).json({
                                message: "Internal Server Error.",
                            });
                        } else {
                            res.status(200).json({
                                message: "Client updated successfully.",
                                data: {
                                    name: client.name,
                                    email: client.email,
                                    phoneNumber: client.phoneNumber,
                                    totalBill: client.totalBill,
                                    updatedAt: client.updatedAt,
                                },
                            });
                        }
                    });
                }
            });
        }
    }
);

router.get("/maxbill", tokenMiddelWare, (req, res, next) => {
    // Get max Total Bill
    Client.findOne({})
        .sort({ totalBill: -1 })
        .exec((err, billClient) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error.",
                });

                return;
            }

            // Find Clients with max Total Bill
            Client.find({ totalBill: billClient.totalBill }, (err, clients) => {
                if (err) {
                    res.status(500).json({
                        message: "Internal Server Error.",
                    });

                    return;
                }

                if (!clients) {
                    res.send(401).json({
                        message: "No data found.",
                    });
                } else {
                    let maxBills = [];
                    clients.forEach((client) => {
                        maxBills.push({
                            AgentName: client.agentName,
                            ClientName: client.name,
                            TotalBill: client.totalBill,
                        });
                    });

                    res.status(200).json({
                        message: "Max Bill Clients",
                        data: maxBills,
                    });
                }
            });
        });
});

module.exports = router;
