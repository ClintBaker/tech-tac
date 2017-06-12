var {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Part} = require('./../server/models/part');
var {User} = require('./../server/models/user');

// Part.remove({}).then((res) => {
//   console.log(res);
// });

// Part.findOneAndRemove({}).then((res) => {
//   console.log(res);
// });

var id = '593dc7d0eaf89fe44aa4a325';
Part.findByIdAndRemove(id).then((res) => {
  console.log(res);
});
