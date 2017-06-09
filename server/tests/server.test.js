const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Part} = require('./../models/part');

beforeEach((done) => {
  Part.remove({}).then(() => done());
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

        Part.find().then((parts) => {
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

        Part.find().then((parts) => {
          expect(parts.length).toBe(0);
        }).catch((e) => done(e));
      })
  });
});
