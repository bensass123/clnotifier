var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




// mongo uri
// mongodb://heroku_tqnglw2f:1d0k7f8k4fd84oa9i6ch35f19i@ds149511.mlab.com:49511/heroku_tqnglw2f

// mongoose

// Database configuration with mongoose
// LOCAL ENVIRONMENT
// mongoose.connect("mongodb://localhost/clnotify");
// PRODUCTION ENVIRONMENT
mongoose.connect("mongodb://heroku_tqnglw2f:1d0k7f8k4fd84oa9i6ch35f19i@ds149511.mlab.com:49511/heroku_tqnglw2f");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//stormpath (order of this is important)

app.use(stormpath.init(app, {
    preRegistrationHandler: function (formData, req, res, next) {
      var c = formData.carrier.toLowerCase().trim();
      var p = formData.phone;
      var legit = ((c === 'att') || (c === 'at&t') || (c === 'metropcs') || (c === 'verizon') || (c === 'cricket') || (c === 'tmobile') || (c === 't-mobile') || (c === 'sprint'));
      if (!legit) {
        return next(new Error('Please register with one of these carriers: T-Mobile, Verizon, Cricket, Sprint, MetroPCS, or AT&T'));
      }

      if(!(p.length === 10)) {
        return next(new Error('Please register with a legitimate phone number of 10 digits'));
      }


      next();
    },
    website: true,
    expand: {
      customData: true,
    },
    web: {
      me: {
        expand: {
          customData: true
        }
      },
      login: {
        nextUri: '/'
      },
      logout: {
          enabled: true,
          nextUri: '/login?next=%2F'
      },
      register: {
        enabled: true,
        uri: '/signup',  // Use a different URL
        autoLogin: true,
        nextUri: '/',    // Where to send the user to, if auto login is enabled
        form: {
          fields: {
            phone: {
              enabled: true,
              label: 'Phone #',
              type: 'number',
              required: true
            },
           carrier: {
             enabled: true,
             required: true,
             label: 'Cell Phone Carrier',
             type: 'text',
             placeholder: 'Sprint, T-Mobile, AT&T, MetroPCS, Cricket, Verizon'
           }
          },
          fieldOrder: [ /* see next section */ ]
        }
      } 
    }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
