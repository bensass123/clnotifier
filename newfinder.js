var rp = require('request-promise');
var cheerio = require("cheerio");
var path = require('path');
var moment = require('moment');

var check = () => {
    
    console.log('init check');
    let url = "https://charlotte.craigslist.org/search/cta";

    rp(url).then(function (html) {

        var minsago15 = moment().subtract(15, 'minutes');
        var dates = [];
	    var $ = cheerio.load(html);
        var results = $('p.result-info');
        // console.log(results)
       
        for (var i = 0; i < results.length; i++) {
            var d = new Date(results[i].children[3].attribs.datetime);
            var t = results[i].children[5].children[0].data;
            var l = results[i].children[5].attribs.href;

            // date handling with moment js
            // d = moment().format(d);
            
            if (d > minsago15) {
                console.log('datetime: ' + d);
                console.log('title:    ' + t);
                console.log('link:     ' + l);
            } else {
                console.log('-----------------------------------------older -------------------------------------------')
                // console.log('datetime: ' + d);
                // console.log('title:    ' + t);
                // console.log('link:     ' + l);
            }
        }
        
    });

    // setTimeout(()=>{}, 6000000)
}

// setTimeout(()=>{check()}, 2000);
check();