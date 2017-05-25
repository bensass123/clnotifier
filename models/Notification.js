// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    category: {
        type: String
    },
    terms: {
        type: String
    },
    pLow: {
        type: String
    },
    pHigh: {
        type: String
    },
    yrEarly: {
        type: String
    },
    yrLate: {
        type: String
    },
    dndStart: {
        type: String
    },
    dndEnd: {
        type: String
    },
    phone: {
        type: String
    },
    carrier: {
        type: String
    },
    email: {
        type: String
    }
})

// Create the Model
var Notification = mongoose.model("Notification", NotificationSchema);

// Export it for use elsewhere
module.exports = Notification;