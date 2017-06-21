const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Part} = require('./../../models/part');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'clinton@gmail.com',
  password: 'userOnePass',
  isAdmin: true,
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jendog@example.com',
  password: 'userTwoPass',
  isAdmin: true,
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const parts = [
  {
    _id: new ObjectID(),
    name: '4.5 Anchor',
    description: 'awesome',
    _creator: userOneId
  }, {
    name: '5.5 Anchor',
    description: 'new description',
    _id: new ObjectID(),
    _creator: userTwoId
  }];

  const populateParts = (done) => {
    Part.remove({}).then(() => {
      return Part.insertMany(parts);
    }).then(() => done());
  };


  const populateUsers = (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    }).then(() => done());
  };

module.exports = {parts, populateParts, populateUsers, users};
