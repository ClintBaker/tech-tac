const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tech-tac', (err, db) => {
  if (err) {
    return console.log('Unable to connect', err);
  }

  console.log('Connected to MongoDB server');

  // db.collection('parts').find({
  //   _id: new ObjectID('59388416b3ea566a2d3d2cc6')
  // }).toArray().then((docs) => {
  //   console.log('Parts');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('cannot fetch todos', err);
  // });

  // db.close();

  db.collection('users').find({name: 'Mesquite'}).count().then((docs) => {
    console.log('Parts count: ', docs);
  }, (err) => {
    console.log('cannot fetch todos', err);
  });
});
