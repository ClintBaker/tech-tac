const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tech-tac', (err, db) => {
  if (err) {
    return console.log('Unable to connect', err);
  }

  console.log('Connected to MongoDB server');

  // db.collection('parts').insertOne({
  //   name: '4.5 TAC',
  //   description: 'Dope af'
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Cannot insert part', err);
  //   }
  //
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  //
  // });

  // db.collection('users').insertOne({
  //   name: 'Mesquite',
  //   address: 'Mesquite, TX',
  //   verified: true
  // }, (err, res) => {
  //   if (err) {
  //     return console.log(err);
  //   }
  //
  //   console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));
  // })
  //
  // db.close();
});
