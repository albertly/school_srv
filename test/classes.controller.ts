import { Schema, Types } from 'mongoose';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';

import connect, { closeDb } from '../server/common/functions';
import Classs, { IClass } from '../server/api/models/classs';
import ClassService from '../server/api/services/class.service';

describe('Class Model', () => {
  // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line prettier/prettier
    const classs = {
    schoolId: '5ebbb6f4d400bbc378eb9860', // '5e63e41cd0b3f77d186680b5',
    name: 'Class1 name2',
  };

  before(async () => {
    await connect({ db: process.env.MONGO as string });
  });

  afterEach(async () => {
    //await Class.remove({});
  });

  after(async () => {
    await closeDb();
  });

  const addClass = async (schoolId: string) => {
    const classs: IClass = {
      schoolId,
      name: `class name ${uuidv4()}`,
    };

    const classDao = new ClassService();
    try {
      return await classDao.add(classs);
    } catch (error) {
      throw error;
    }
  };

  it(`should create a new Class from ClassDao`, done => {
    addClass(classs.schoolId).then(() => done());
  });

  it(`should get Class by classId`, done => {
    const classDao = new ClassService();
    //'5e6a79d5b519b61c7c2f6088'
    classDao.getOne('5ebbb980f28589e2dc039bb0').then(r => {
      console.log('Class: ', r);
      done();
    });
  });

  it('should update class by id from classDao', done => {
    const classDao = new ClassService();
    const newName = `New class name ${uuidv4()}`;

    addClass(classs.schoolId)
      .then(r => {
        classDao.update(r._id, { name: newName }).then(r1 => {
          expect(r1.status).equals('204');
          expect(r1.record.name).equals(newName);
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
    const classDao = new ClassService();
    const newName = `New school name ${uuidv4()}`;

    addClass(classs.schoolId)
      .then(r => {
        classDao
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

  it(`should get a classes by school id `, done => {
    const classDao = new ClassService();

    classDao.getAllBySchoolId(classs.schoolId).then(result => {
      console.log('result getAllBySchoolId ', result);
      done();
    });
  });

  // it('should delete school by id from schoolDao', (done) => {
  //     const schoolDao = new ClassService();
  //     addSchool()
  //     .then(r => {
  //         schoolDao.delete(r._id).then(() => {
  //             console.log('school deleted');
  //             done();
  //     })

  //     }).catch(error => {
  //         console.log(error);
  //         done();
  //     })
  // })

  it(`should get Class by name from ClassDao1`, done => {
    const ClassDao = new ClassService();

    addClass(classs.schoolId).then(r => {
      ClassDao.getOneByName(r.name).then(result => {
        expect(r.name).equals(result.name);
        done();
      });
    });
  });
});
