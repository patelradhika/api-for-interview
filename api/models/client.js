const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    agentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
    agentName: {
        type: String,
        ref: "Agent",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    totalBill: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

// On every save add the date
clientSchema.pre("save", (next) => {
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

module.exports = mongoose.model("Client", clientSchema);
