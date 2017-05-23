var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var User = require('../models/User.js');
var Notification = require('../models/Notification.js');

var helpers = require('./helpers');

// add delete method for notifications
// add display of notifications



/* GET home page. */
router.get('/', stormpath.loginRequired, function(req, res, next) {
  res.sendFile(path.join(__dirname, '/../views/index.html'));
});

router.get('/user', stormpath.loginRequired, function(req, res, next) {
  res.json(req.user);
});

router.get('/notifications', stormpath.loginRequired, function(req, res, next) {
  console.log('get route notifications, email: ');
  console.log(req.user.email);
  User.findOne({email: req.user.email}, 'notifications', function (err, doc) {
    if (err) {
        return handleError(err)
    }
    else {
        var obj = {
            notifications: doc.notifications

        }
        res.send(obj);
    }
  });

  // this route will return the array of notifications for the user
})

router.post('/addNotification', stormpath.loginRequired, function(req, res, next) {

  console.log('index.js body');
  console.log(req.body);

  helpers.addNotification(req.body, req.user);

  res.send(req.body);
  
});

router.post('/inituser', stormpath.loginRequired, function(req, res, next) {
  if (!req.user.customData.notifications){
    req.user.customData.notifications = [];
    req.user.customData.save();
  }

  helpers.addUser(req.user);
  
  res.end();
});



module.exports = router;
