const jwt = require("jsonwebtoken");

const CONFIG = require("../../config.json");
const TOKEN_SECRET = CONFIG.token.secret;

// route middleware to verify a token
module.exports = (req, res, next) => {
    // get token from header
    let token = req.headers["authorization"].split(" ")[1];

    // decode token
    if (token) {
        // verify the token
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // Return error (Forbidden)
                res.status(403).json({
                    status: "failed",
                    message: "Failed to authenticate token.",
                });

                return;
            }

            // if everything is good, save to req for other routers
            req.decoded = decoded;
            next();
        });
    } else {
        // there is no token, return error (Forbidden)
        res.status(403).json({
            status: "failed",
            message: "No Authorization/Bearer token provided",
        });
    }
};
