var mongoose = require('mongoose');
var User = require('../models/User.js');
var SearchFound = require('../models/SearchFound.js');
var Notification = require('../models/Notification.js');
var rp = require('request-promise');
var cheerio = require("cheerio");
var Send = require('gmail-send')({
  user: 'bensass123@gmail.com',               // Your GMail account used to send emails 
  pass: 'pzmyoifdzehxhxaz',             // Application-specific password 
  to:   'test@test.com',               // Send back to yourself;  
                                        // you also may set array of recipients:  
                                        // [ 'user1@gmail.com', 'user2@gmail.com' ] 
  // from:   '"User" <user@gmail.com>'  // from: by default equals to user 
  // replyTo:'user@gmail.com'           // replyTo: by default undefined 
  subject: 'default subject',
  text:    'default body'
  // html:    '<b>html text text</b>' 
});

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
        main(notifications);
    })
}

var sample = {
  category: 'Free Stuff',
  terms: 'wood',
  pLow: 'na',
  pHigh: 'na',
  yrEarly: 'na',
  yrLate: 'na',
  dndStart: '23:45',
  dndEnd: '07:00',
  email: 'clnotifier2@gmail.com',
  phone: '7044318038',
  carrier: 'metropcs'
}


// takes in object and searches craigslist for it

var main = (obj) => {
    var url;
    for (var i = 0; i < obj.length; i++) {
        switch (obj[i].category) {
            case 'Free Stuff':
                console.log('free category');
                url = "https://charlotte.craigslist.org/search/zip?query=" + obj[i].terms;
                searchCl(obj[i], url);

        }
    }
}

var address = (obj) => {
    //return email address, concat phone + carrier string
    switch (obj.carrier.toLowerCase()) {
        case 'metropcs': 
            return obj.phone + '@mymetropcs.com'
    }
}



var searchCl = (obj, url) => {
    // found objects
    var founds = [];

    rp(url).then(function (html) {
	    var $ = cheerio.load(html);
	    // console.log(url);

	    var results = $('a.result-title');
	    // console.log('results:  ***********');
	    // console.log(results);
	    for (var i = 0; i < results.length; i++) {

	    	var link = results[i]['attribs'].href;
	    	var title = results[i]['children'][0].data;

            if (link[1] == '/') {
                link = 'https:' + link;
            }
            else {
                link = 'https://charlotte.craigslist.org' + link;
            }
            

            var found = {
                link: link,
                title: title,
                email: obj.email,
                phone: obj.phone,
                carrier: obj.carrier,
                deleted: false,
                givenName: obj.givenName,
                sent: false
            }

            founds.push(found);
            console.log(obj.email, found.link, found.title)
            SearchFound.update({email: found.email, link: found.link, title: found.title}, found, {upsert:true}, function (err, doc){
                if (err) console.log(err);
                console.log('search found and added')
                console.log(doc);
            })
        }

         // sending out text notifications here
          founds.forEach((elem, i) =>{
            if (!elem.sent) {
                Send({
                    subject: elem.title,
                    text: 'Your search produced the following result ' +  elem.link,
                    to: address(elem)
                }, function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            
                            // code to update sent to true
                            SearchFound.update({email: elem.email, link: elem.link, title: elem.title}, {$set: {sent: true}}, function (err, doc){
                                if (err) console.log(err);
                                    console.log('updated ' + elem.title + ' to sent' )
                                    console.log(doc);
                            })

                        }
                })
            }
            
          })      

                
        
    })

}