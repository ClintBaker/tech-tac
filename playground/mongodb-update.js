
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/tech-tac', (err, db) => {
  if (err) {
    return console.log('Unable to connect', err);
  }

  console.log('Connected to MongoDB server');

  db.collection('parts').findOneAndUpdate({description: 'very nice'}, {
    $set: {
      description: 'super nice'
    }
  }, {
    returnOriginal: false
  }).then((res) => console.log(res));



});
