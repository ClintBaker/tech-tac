require('./config/config');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const moment = require('moment');

var {mongoose} = require('./db/mongoose');
var {Part} = require('./models/part');
var {User} = require('./models/user');
var {Order} = require('./models/order');
var {authenticate} = require('./middleware/authenticate');
var {authenticateAdmin} = require('./middleware/authenticateAdmin');

var app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  allowedHeaders: ['Accept-Version', 'Authorization', 'x-auth', 'Credentials', 'Content-Type'],
  exposedHeaders: ['X-Request-Id', 'x-auth'],
  preflightContinue: true
};

app.use(cors(corsOptions));

const port = process.env.PORT;

app.use(bodyParser.json());

// Create Part

app.post('/parts', authenticateAdmin, (req, res) => {
  var part = new Part({
    name: req.body.name,
    description: req.body.description,
    _creator: req.user._id,
    number: req.body.number,
    image: req.body.image
  });

  part.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);

  });
});

// Get all Parts

app.get('/parts', authenticate, (req, res) => {
  // Part.find({
  //   _creator: req.user._id
  // })
  Part.find().then((parts) => {
    res.send({parts});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get Parts by ID

app.get('/parts/:id', authenticate, (req, res) => {
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

app.delete('/parts/:id', authenticateAdmin, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Part.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((part) => {
    if (!part) {
      return res.status(404).send();
    }

    res.send({part, deleted: true});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Update Part by ID

app.patch('/parts/:id', authenticateAdmin, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name', 'description']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Part.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((part) => {
    if (!part) {
      return res.status(404).send();
    }

    res.send({part});
  }).catch((e) => {
    res.status(400).send();
  })

});



//GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'companyName', 'phone', 'url', 'contactName', 'address']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//PATCH /users  **Needs testing
app.patch('/users/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['password', 'email', 'companyName', 'phone', 'url', 'contactName', 'address']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (req.user._id != id) {
    return res.status(401).send();
  }

  User.findOneAndUpdate({_id: req.user._id}, {$set: body}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.send({user});
  }).catch((e) => {
    res.status(400).send();
  })

});

//DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

//POST /orders
app.post('/orders', authenticate, (req, res) => {
  var body = _.pick(req.body, ['parts', '_companyId']);
  var timestamp = Date.now();
  var order = new Order({
    parts: body.parts,
    _companyId: body._companyId,
    createdAt: Date.now()
  });

  order.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET /orders/all
app.get('/orders/all', authenticateAdmin, (req, res) => {
  Order.find().then((orders) => {
    res.send({orders});
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET /orders

app.get('/orders', authenticate, (req, res) => {
  Order.find({
    _companyId: req.user._id
  }).then((orders) => {
    res.send({orders});
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET /orders/:id
app.get('/orders/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (req.user.isAdmin) {
    Order.findById(id).then((order) => {
      if (!order) {
        return res.status(404).send();
      }
      res.send({order});
    }).catch((e) => {
      res.status(400).send();
    })
  } else {
    Order.findOne({
      _companyId: req.user._id,
      _id: req._id
    }).then((order) => {
      if (!order) {
        return res.status(404).send();
      }
      res.send({order});
    }).catch((e) => {
      res.status(400).send();
    });
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};



// https://powerful-badlands-45228.herokuapp.com/
