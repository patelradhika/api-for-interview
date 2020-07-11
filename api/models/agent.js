const mongoose = require("mongoose");

const agentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    clients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

// On every save add the date
agentSchema.pre("save", (next) => {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }

    next();
});

module.exports = mongoose.model("Agent", agentSchema);
