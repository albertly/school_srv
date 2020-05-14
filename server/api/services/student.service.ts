import Student, { IStudent } from '../models/student';
import Classs from '../models/classs';
import L from '../../common/logger';

export interface IStudentRet {
  record?: any;
  status: string;
}

class StudentService {
  public async getOne(tz: string): Promise<IStudent | null> {
    const result = await Student.findOne({ tz });
    return result as IStudent | null;
  }

  public async getAllByClassId(classId: string): Promise<any> {
    try {
      const students = await Classs.findById(classId).populate('students');
      return students;
    } catch (err) {
      throw err;
    }
  }

  public async add(student: IStudent): Promise<any> {
    const studentModel = new Student({
      tz: student.tz,
      name: student.name,
      classId: student.classId,
    });

    try {
      const classs = await Classs.findById(student.classId);

      if (!classs) {
        L.error(`Cannot find class ${student.classId}`);
        return false;
      }

      const studentResult = await studentModel.save();

      classs.students.push(studentResult._id);

      await classs.save();

      return studentResult as any;
    } catch (error) {
      L.error(error);
      return error;
    }
  }

  public async update(id: string, student: IStudent): Promise<IStudentRet> {
    try {
      const studentToUpdate = await Student.findById(id);
      if (!studentToUpdate) {
        return { status: '404' };
      }

      for (const f in student) {
        studentToUpdate[f] = student[f];
      }

      const ret = await studentToUpdate.save();

      return {
        record: ret,
        status: '204',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<string> {
    try {
      const result = await Student.findOne({ _id: id }, { grades: 1 });
      if (!result) {
        return '404';
      } else {
        if (result.grades.length) {
          return '400';
        }
      }
      await Student.find({ _id: id }).remove();
      return '204';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default StudentService;
