const express = require("express");
const mongoose = require("mongoose");
const app = express();

const CONFIG = require("./config.json");
const DATABASE_KEY = CONFIG.database.key;
const DATABASE_NAME = CONFIG.database.name;

const PORT = process.env.PORT || 3000;

mongoose.connect(
    `mongodb+srv://radhikapatel:${DATABASE_KEY}@cluster0-0uws2.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    next();
});

const usersRoutes = require("./api/routes/users");
const serviceRoutes = require("./api/routes/services");

app.use("/api/user", usersRoutes);
app.use("/api/services", serviceRoutes);

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});
