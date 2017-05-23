// test scheduled task ability to call db

console.log('start test123.js')

var mongoose = require('mongoose');
var User = require('../models/User')

mongoose.connect("mongodb://heroku_tqnglw2f:1d0k7f8k4fd84oa9i6ch35f19i@ds149511.mlab.com:49511/heroku_tqnglw2f");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");

  // call db to get all notifications for each user
  setTimeout(()=>{
    User.find({}, 'email carrier phone firstName notifications', function (err, person) {
        if (err) return handleError(err);
        for (var i = 0; i < person.length; i++){
            console.log(person[i].firstName);
            console.log(person[i].carrier);
            console.log(person[i].phone);
            console.log(person[i].notifications);
        }
        
    })

  }, 4000);
  

  
  
});




