// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SearchFoundSchema = new Schema({
    email: {
        type: String
    },
    link: {
        type: String
    },
    title: {
        type: String
    },
    phone: {
        type: String
    },
    carrier: {
        type: String
    },
    deleted: {
        type: Boolean
    },
    sent: {
        type: Boolean
    }
})

// Create the Model
var SearchFound = mongoose.model("SearchFound", SearchFoundSchema);

// Export it for use elsewhere
module.exports = SearchFound;