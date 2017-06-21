const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Part} = require('./../models/part');
const {parts, populateParts, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateParts);

describe('POST /parts', () => {
  it('should create a new part', (done) => {
    var name = 'Slumberger';

    request(app)
      .post('/parts')
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Part.find({name}).then((parts) => {
          expect(parts.length).toBe(1);
          expect(parts[0].name).toBe(name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a new part with bad data', () => {
    request(app)
      .post('/parts')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Part.find({}).then((parts) => {
          expect(parts.length).toBe(2);
        }).catch((e) => done(e));
      })
  });
});

describe('GET /parts', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/parts')
      .expect(200)
      .expect((res) => {
        expect(res.body.parts.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /parts/:id', () => {
  it('should return part doc', (done) => {
    request(app)
      .get(`/parts/${parts[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.part.name).toBe(parts[0].name);
      })
      .end(done);
  });

  it('should return 404 if part not found', (done) => {
    request(app)
    .get(`/parts/${new ObjectID().toHexString}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/parts/1234')
      .expect(404)
      .end(done);
  })
});


describe('DELETE /parts/:id', () => {
  it('should remove a part', (done) => {
    var hexId = parts[1]._id.toHexString();
    request(app)
      .delete(`/parts/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.part._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Part.findById(hexId).then((part) => {
          expect(part).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if part not found', (done) => {
    request(app)
      .delete(`/parts/${new ObjectID().toHexString}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
      .delete('/parts/1234')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /parts/:id', () => {
  it('should update part', (done) => {
    var id = parts[0]._id.toHexString();
    var updates = {
      name: 'New name',
      description: 'New desc'
    };
    request(app)
      .patch(`/parts/${id}`)
      .send({name: updates.name, description: updates.description})
      .expect(200)
      .expect((res) => {
        expect(res.body.part.name).toBe(updates.name);
        expect(res.body.part.description).toBe(updates.description);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'ex@example.com';
    var password = 'password';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'email';
    var password = '1';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in user', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'password'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth'] /////problem problem problem no problem
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email: 'email', password: 'p'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token )
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
