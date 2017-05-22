var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');



/* GET home page. */
router.get('/', stormpath.loginRequired, function(req, res, next) {
  res.sendFile(path.join(__dirname, '/../public/index.html'));
});



module.exports = router;
