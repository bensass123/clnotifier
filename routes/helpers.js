 
 var User = require('../models/User.js');
 
 module.exports = {
    addUser: (user) => {

            var p = user.customData.phone.trim();
            var c = user.customData.carrier;
            var arr = user.customData.notifications;
            console.log(user);
            console.log(arr);
            // console.log(p);
            // console.log(c);
            console.log('init user');
            
            // var notifications = [];
            // if(!user.customData.notifications) {
            //     notifications = [];
            // }
            // else{
            //     notifications = user.customData.notifications;
            // }

            if(!arr) {
                arr = [];
                console.log('no notifications array in customdata')
            }

            var obj = {
                firstName: user.givenName,
                lastName: user.surname,
                email: user.email,
                phone: p,
                carrier: c
            }

            
            return User.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
                if (err) {console.log(err);}
                else {console.log(doc);}
            })
        },

        addNotification: (body, user) => {
            console.log('helpers:');
            console.log('body');
            console.log(body);
            console.log('user');
            console.log(user);
            var category = body.category;
            var terms =  body.terms;
            var pLow = body.pLow;
            var pHigh = body.pHigh;
            var yrEarly = body.yrEarly || 'na';
            var yrLate = body.yrLate || 'na';
            // do not disturb times
            var dndStart = body.dndStart;
            var dndEnd = body.dndEnd;
            // var p = user.phone;
            // var c = user.carrier;
            // var n = user.firstName;

            // create object to represent notification
            var obj = {
                category: category,
                terms: terms,
                pLow: pLow,
                pHigh: pHigh,
                yrEarly: yrEarly,
                yrLate: yrLate,
                dndStart: dndStart,
                dndEnd: dndEnd
            }

            return User.update({email: user.email},  { $addToSet: { notifications: obj } }, (err, doc) => {
                if (err) {console.log(err);}
                else {console.log(doc);}
            })
        }
}