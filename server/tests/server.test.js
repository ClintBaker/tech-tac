const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Part} = require('./../models/part');

const parts = [
  {
    _id: new ObjectID(),
    name: '4.5 Anchor',
    description: 'awesome'
  }, {
    name: '5.5 Anchor',
    _id: new ObjectID()
  }];

beforeEach((done) => {
  Part.remove({}).then(() => {
    return Part.insertMany(parts);
  }).then(() => done());
});

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
