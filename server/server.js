var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Part} = require('./models/part');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/parts', (req, res) => {
  var part = new Part({
    name: req.body.name,
    description: req.body.description
  });

  part.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);

  });
});

app.get('/parts', (req, res) => {
  Part.find().then((parts) => {
    res.send({parts});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
