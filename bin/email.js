var mongoose = require('mongoose');
var User = require('../models/User.js');
var SearchFound = require('../models/SearchFound.js');
var Notification = require('../models/Notification.js');


// globals
var notifications;

// mongoose connection string
mongoose.connect("mongodb://heroku_tqnglw2f:1d0k7f8k4fd84oa9i6ch35f19i@ds149511.mlab.com:49511/heroku_tqnglw2f");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
  retrieveNotifications();
});




var retrieveNotifications = () => {
    Notification.find({}).exec((err, notes) => {
        console.log('retrieve run')
        if (err) return handleError(err);
        notifications = notes;
        // temp
        for (var i = 0; i < notifications.length; i++) {
            console.log(address(notifications[i]));
        }
        
    })
}

var address = (obj) => {
    //return email address, concat phone + carrier string
    switch (obj.carrier.toLowerCase()) {
        case 'metropcs': 
            return obj.phone + '@mymetropcs.com'
    }
}




var Send = require('gmail-send')({
  user: 'bensass123@gmail.com',               // Your GMail account used to send emails 
  pass: 'pzmyoifdzehxhxaz',             // Application-specific password 
  to:   '7046056635@mymetropcs.com',               // Send back to yourself;  
                                        // you also may set array of recipients:  
                                        // [ 'user1@gmail.com', 'user2@gmail.com' ] 
  // from:   '"User" <user@gmail.com>'  // from: by default equals to user 
  // replyTo:'user@gmail.com'           // replyTo: by default undefined 
  subject: 'default subject',
  text:    'default body'
  // html:    '<b>html text text</b>' 
});


// get stuff from database

// send({
//     subject: 'subject',
//     text: 'text'
// }, function (err, res) {
//     console.log('err:', err, '; res:', res);
// })

module.exports = Send;



