var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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

// GET/todos/1234235

app.get('/parts/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Part.findById(id).then((part) => {
    if (!part) {
      return res.status(404).send();
    }
    res.send({part});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
