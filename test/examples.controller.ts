import axios from 'axios';

import 'mocha';
import { expect } from 'chai';
// import request from 'supertest';
import Server from '../server';

describe.skip('Examples', () => {
  it.skip('should bring page', done => {
    console.log('Test Print');
    const url = 'https://www.worldometers.info/coronavirus';
    //const url = 'https://www.google.com';
    try {
      const fetchOpt = {
        url,
        method: 'GET',
        cache: 'no-cache',
        mode: 'no-cors',
      };
      // const r = await fetch(url);
      // const j = await r.blob();

      axios
        .get(url)
        .then(r => {
          console.log(r);
          done();
        })
        .catch(e => {
          console.log('e', e);
          done();
        });
    } catch (err) {
      console.log('err', err);
      done();
    }
  });

  // it('should get all examples', () =>
  //   request(Server)
  //     .get('/api/v1/examples')
  //     .expect('Content-Type', /json/)
  //     .then(r => {
  //       expect(r.body)
  //         .to.be.an('array')
  //         .of.length(2);
  //     }));

  // it('should add a new example', () =>
  //   request(Server)
  //     .post('/api/v1/examples')
  //     .send({ name: 'test' })
  //     .expect('Content-Type', /json/)
  //     .then(r => {
  //       expect(r.body)
  //         .to.be.an('object')
  //         .that.has.property('name')
  //         .equal('test');
  //     }));

  // it('should get an example by id', () =>
  //   request(Server)
  //     .get('/api/v1/examples/2')
  //     .expect('Content-Type', /json/)
  //     .then(r => {
  //       expect(r.body)
  //         .to.be.an('object')
  //         .that.has.property('name')
  //         .equal('test');
  //     }));
});
