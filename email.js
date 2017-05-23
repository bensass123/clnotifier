// pzmyoifdzehxhxaz


var send = require('gmail-send')({
  user: 'bensass123@gmail.com',               // Your GMail account used to send emails 
  pass: 'pzmyoifdzehxhxaz',             // Application-specific password 
  to:   '7046056635@mymetropcs.com',               // Send back to yourself;  
                                        // you also may set array of recipients:  
                                        // [ 'user1@gmail.com', 'user2@gmail.com' ] 
  // from:   '"User" <user@gmail.com>'  // from: by default equals to user 
  // replyTo:'user@gmail.com'           // replyTo: by default undefined 
  subject: 'test subject',
  text:    'test text'
  // html:    '<b>html text text</b>' 
});

// send({
//     subject: 'your search of hondas found 1 new honda'
// }, function (err, res) {
//     console.log('err:', err, '; res:', res);
// })



