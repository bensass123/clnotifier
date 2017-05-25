var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var User = require('../models/User.js');
var SearchFound = require('../models/SearchFound.js');
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
})

router.get('/founds', stormpath.loginRequired, function(req, res, next) {
  console.log('get route notifications, email: ');
  console.log(req.user.email);
  SearchFound.find({email: req.user.email, deleted: false}, function (err, docs) {
    if (err) {
        return handleError(err)
    }
    else {
        res.send(docs);
    }
  });
})

router.get('/allfounds', stormpath.loginRequired, function(req, res, next) {
  console.log('get route notifications, email: ');
  console.log(req.user.email);
  SearchFound.find({email: req.user.email}, function (err, docs) {
    if (err) {
        return handleError(err)
    }
    else {

        res.send(docs);
    }
  });
})

router.get('/deletedfounds', stormpath.loginRequired, function(req, res, next) {
  console.log('get route notifications, email: ');
  console.log(req.user.email);
  SearchFound.find({email: req.user.email, deleted: true}, function (err, docs) {
    if (err) {
        return handleError(err)
    }
    else {

        res.send(docs);
    }
  });
})

router.post('/addNotification', stormpath.loginRequired, function(req, res, next) {

  console.log('index.js body');
  console.log(req.body);

  helpers.addNotification(req.body, req.user);

  res.end();
  
});

router.post('/deleteNotification', stormpath.loginRequired, function(req, res, next) {
  // find based on terms plow and phigh
  User.update({email: req.user.email}, { $pull: { notifications: { terms: req.body.terms, pLow: req.body.pLow, pHigh: req.body.pHigh } } }, function(err, newdoc) {
      // Send any errors to the browser
      if (err) {
        res.send(err);
      }
      // Or send the newdoc to the browser
      else {
        console.log(newdoc);
        // also remove from note model
        Notification.remove({ email: req.user.email, terms: req.body.terms, pLow: req.body.pLow, pHigh: req.body.pHigh }, function(err, newdoc) {
          if (err) return handleError(err);
          console.log(newdoc);
          res.end();
        })
      }
  });
})



router.post('/deleteFound', stormpath.loginRequired, function(req, res, next) {
  SearchFound.update({email: req.user.email, link: req.body.link, title: req.body.title }, { $set: { deleted: true } }, function(err, newdoc) {
            if (err) return handleError(err);
            console.log(newdoc);
            res.end();
  });
})

// this will be linked to a button under the users pereviously delted searches

router.post('/undeleteFound', stormpath.loginRequired, function(req, res, next) {
  SearchFound.update({email: req.user.email, link: req.body.link, title: req.body.title }, { $set: { deleted: false } }, function(err, newdoc) {
            if (err) return handleError(err);
            console.log(newdoc);
            res.end();
  });
})

router.post('/inituser', stormpath.loginRequired, function(req, res, next) {
  helpers.addUser(req.user);
  res.end();
});



module.exports = router;
