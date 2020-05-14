import uuidv4 from 'uuid/v4';
import { expect } from 'chai';
import request from 'supertest';

import Server from '../server';
import connect, { closeDb } from '../server/common/functions';
import School, { ISchool } from '../server/api/models/school';
import SchoolsService from '../server/api/services/schools.service';

describe('School Model', () => {
  const school = {
    name: `school1 name2 ${uuidv4()}`,
    logo: 'school logo',
    motor: 'school motor',
  };

  before(async () => {
    await connect({ db: process.env.MONGO as string });
  });

  afterEach(async () => {
    // await School.remove({});
  });

  after(async () => {
    await closeDb();
  });

  const addSchool = async () => {
    const school = {
      name: `school name ${uuidv4()}`,
      logo: 'school logo',
      motor: 'school motor',
    };
    const schoolDao = new SchoolsService();
    try {
      return await schoolDao.add(school);
    } catch (error) {
      throw error;
    }
  };

  it.skip(`should create a new school`, done => {
    const schoolModel = new School({ ...school });

    schoolModel.save().then(() => done());
  });

  it(`should create a new school from schoolDao`, done => {
    addSchool().then(r => {
      console.log(r);
      done();
    });
  });

  //   it.only('should get get all schools', () =>
  //     request(Server)
  //       .get('/api/v1/schools')
  //       .expect('Content-Type', /json/)
  //       .then(r => {
  //         expect(r.body).to.be.an('array');
  //         console.log('Schools', r.body);
  //       }));

  it(`should get a school by name from schoolDao`, done => {
    const schoolDao = new SchoolsService();

    addSchool().then(r => {
      console.log('r', r);
      schoolDao.getOne(r.name).then(result => {
        console.log('result', result);
        done();
      });
    });
  });

  it('should return all schools from schoolDao', done => {
    const schoolDao = new SchoolsService();

    schoolDao.getAll().then(result => {
      console.log('result all schools', result);
      done();
    });
  });

  it('should delete school by id from schoolDao', done => {
    const schoolDao = new SchoolsService();
    addSchool()
      .then(r => {
        schoolDao.delete(r._id).then(() => {
          console.log('school deleted');
          done();
        });
      })
      .catch(error => {
        console.log(error);
        done();
      });
  });

  it('should update school by id from schoolDao', done => {
    const schoolDao = new SchoolsService();
    const newName = `New school name ${uuidv4()}`;

    addSchool()
      .then(r => {
        schoolDao.update(r._id, { name: newName }).then(r1 => {
          expect(r1.status).equals('204');
          expect(r1.record.name).equals(newName);
          expect(r1.record.logo).equals(r.logo);
          expect(r1.record._id.toString()).equals(r._id.toString());
          done();
        });
      })
      .catch(error => {
        console.log(error);
        done();
      });
  });

  it('should return 404 when update school by wrong id from schoolDao', done => {
    const schoolDao = new SchoolsService();
    const newName = `New school name ${uuidv4()}`;

    addSchool()
      .then(r => {
        schoolDao
          .update('5e63e41cd0b3f77d18ffffff', { name: newName })
          .then(r1 => {
            expect(r1.status).equals('404');
            expect(r1.record == null).to.be.true;
            done();
          });
      })
      .catch(error => {
        console.log(error);
        done();
      });
  });
});
