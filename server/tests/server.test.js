const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Part} = require('./../models/part');

const parts = [
  {
    name: '4.5 Anchor',
    description: 'awesome'
  }, {
    name: '5.5 Anchor'
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
