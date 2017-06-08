
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tech-tac', (err, db) => {
  if (err) {
    return console.log('Unable to connect', err);
  }

  console.log('Connected to MongoDB server');

  // db.collection('parts').deleteMany({description: 'very nice'}).then((res) => {
  //   console.log(res);
  // });

  // db.collection('parts').deleteOne({description: 'very nice'}).then((res) => {
  //   console.log(res);
  // });

  // db.collection('parts').findOneAndDelete({description: 'very nice'}).then((res) => {
  //   console.log(res);
  // });



});
