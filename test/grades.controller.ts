import { Schema, Types } from 'mongoose';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';

import connect, { closeDb } from '../server/common/functions';
import Grade, { IGrade } from '../server/api/models/grade';
import GradeService from '../server/api/services/grade.service';

describe.only('Grade Model', () => {
  const grade = {
    studentId: '5ebbcd801905a611305606d6', //'5e6bd38df18678844c2d941e',
    subject: 'מטמטיקה',
    year: 2020,
    first: 89,
    second: 90,
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

  const addGrade = async (studentId: string) => {
    const grade_: IGrade = { ...grade, ...{ studentId } };

    const gradeDao = new GradeService();
    try {
      return await gradeDao.add(grade_);
    } catch (error) {
      throw error;
    }
  };

  it(`should create a new grade `, done => {
    addGrade(grade.studentId).then(() => done());
  });

  it('should update grade by id', done => {
    const GradeDao = new GradeService();
    const newFirst = Math.floor(Math.random() * 101);
    const newSecond = Math.floor(Math.random() * 101);

    addGrade(grade.studentId)
      .then(r => {
        GradeDao.update(r._id, { first: newFirst, second: newSecond }).then(
          r1 => {
            expect(r1.status).equals('204');
            expect(r1.record.first).equals(newFirst);
            expect(r1.record._id.toString()).equals(r._id.toString());
            done();
          }
        );
      })
      .catch(error => {
        console.log(error);
        done();
      });
  });

  it('should return 404 when update grade by wrong id', done => {
    const GradeDao = new GradeService();
    const newFirst = Math.floor(Math.random() * 101);
    const newSecond = Math.floor(Math.random() * 101);

    addGrade(grade.studentId)
      .then(r => {
        GradeDao.update('5e63e41cd0b3f77d18ffffff', {
          first: newFirst,
          second: newSecond,
        }).then(r1 => {
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

  it(`should get grade by student id and year`, done => {
    const GradeDao = new GradeService();

    addGrade(grade.studentId).then(r => {
      GradeDao.getOne(grade.studentId, grade.year).then(result => {
        console.log('result getGradeBySudentIdandYear ', result);
        done();
      });
    });
  });
});
