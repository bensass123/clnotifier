 
  var User = require('../models/User.js');
  var Notification = require('../models/Notification.js');

 module.exports = {
    addUser: (user) => {

            var p = user.customData.phone.trim();
            var c = user.customData.carrier;

            console.log(p);
            console.log(c);
            console.log('init user');
            
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
            var pLow = body.pLow || 'na';
            var pHigh = body.pHigh || 'na';
            var yrEarly = body.yrEarly || 'na';
            var yrLate = body.yrLate || 'na';

            // do not disturb times
            var dndStart = body.dndStart;
            var dndEnd = body.dndEnd;

            // phone and carrier
            var p = user.customData.phone.trim();
            var c = user.customData.carrier;

            // create object to represent notification
            var obj = {
                category: category,
                terms: terms,
                pLow: pLow,
                pHigh: pHigh,
                yrEarly: yrEarly,
                yrLate: yrLate,
                dndStart: dndStart,
                dndEnd: dndEnd,
                email: user.email,
                phone: p,
                carrier: c
            }

            var a1 = User.update({email: user.email},  { $addToSet: { notifications: obj } }, (err, doc) => {
                if (err) {console.log(err);}
                else {console.log(doc);}
            });

            var a2 = Notification.create(obj, function (err, doc){
                if (err) return handleError(err);
                console.log('---------------NOTIFICATION DOC CREATION----', doc)
            });
            return a1 && a2;
        }
}