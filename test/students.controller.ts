import { Schema, Types } from 'mongoose';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';

import connect, { closeDb } from '../server/common/functions';
import Student, { IStudent } from '../server/api/models/student';
import StudentService from '../server/api/services/student.service';

describe('Student Model', () => {
  const student = {
    classId: '5ebbb980f28589e2dc039bb0', // '5e6a79d5b519b61c7c2f6088',
    tz: '18',
    name: 'Student Name 1',
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

  const addStudent = async (classId: string) => {
    const student: IStudent = {
      classId,
      tz: uuidv4(),
      name: `student name`,
    };

    const studentDao = new StudentService();
    try {
      return await studentDao.add(student);
    } catch (error) {
      throw error;
    }
  };

  it(`should create a new Student from StudentDao`, done => {
    addStudent(student.classId).then(() => done());
  });

  it('should update student by id', done => {
    const studentDao = new StudentService();
    const newName = `New student name ${uuidv4()}`;

    addStudent(student.classId)
      .then(r => {
        studentDao.update(r._id, { name: newName }).then(r1 => {
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

  it('should return 404 when update student by wrong id', done => {
    const classDao = new StudentService();
    const newName = `New student name ${uuidv4()}`;

    addStudent(student.classId)
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

  it(`should get a student by class id `, done => {
    const studentDao = new StudentService();

    studentDao.getAllByClassId(student.classId).then(result => {
      console.log('result getAllByClassId ', result);
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

  it(`should get Student by tz`, done => {
    const StudentDao = new StudentService();

    addStudent(student.classId).then(r => {
      StudentDao.getOne(r.tz).then(result => {
        expect(r.tz).equals(result.tz);
        done();
      });
    });
  });
});
