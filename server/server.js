require('./config/config');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Part} = require('./models/part');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Create Part

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

// Get all Parts

app.get('/parts', (req, res) => {
  Part.find().then((parts) => {
    res.send({parts});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get Parts by ID

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

// Delete Part by ID

app.delete('/parts/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Part.findByIdAndRemove(id).then((part) => {
    if (!part) {
      return res.status(404).send();
    }

    res.send({part, deleted: true});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Update Part by ID

app.patch('/parts/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name', 'description']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Part.findByIdAndUpdate(id, {$set: body}, {new: true}).then((part) => {
    if (!part) {
      return res.status(404).send();
    }

    res.send({part});
  }).catch((e) => {
    res.status(400).send();
  })

});


// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
