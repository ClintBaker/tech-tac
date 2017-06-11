var {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Part} = require('./../server/models/part');
var {User} = require('./../server/models/user');

// var id = '593b401bd30aa1d814539a76';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Part.find({
//   _id: id
// }).then((parts) => {
//   console.log('Parts', parts);
// });
//
// Part.findOne({
//   _id: id
// }).then((part) => {
//   console.log('Find one part', part);
// });

// Part.findById(id).then((part) => {
//   if (!part) {
//     return console.log('Id not valid');
//   }
//   console.log('Find by id', part);
// }).catch((e) => {
//   console.log(e);
// });

var id = '5939a63220aeaeccf16c55ca';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found')
  }

  console.log('User: ', user);
}).catch((e) =>  console.log(e));
