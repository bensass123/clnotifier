// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    sentTo: {
        type: String
    },
    link: {
        type: String
    },
    timeSent: {
        type: Date
    }
})

// Create the Model
var Notification = mongoose.model("Notification", NotificationSchema);

// Export it for use elsewhere
module.exports = Notification;