import { Types } from 'mongoose';
import Grade, { IGrade } from '../models/grade';
import Student from '../models/student';
import L from '../../common/logger';

export interface IGradeRet {
  record?: any;
  status: string;
}

class GradeService {
  public async getOne(studentId: string, year: number): Promise<any> {
    const result = await Grade.find({ studentId, year });
    return result;
  }

  public async getAllByStudentId(studentId: string): Promise<any> {
    try {
      const grades = await Grade.find({ studentId });
      return grades;
    }
    catch (err) {
      throw err;
    }

  }

  public async add(grade: IGrade): Promise<any> {
    const gradeModel = new Grade({
      studentId: grade.studentId,
      subject: grade.subject,
      year: grade.year,
      first: grade.first,
      second: grade.second,
    });

    try {
      const student = await Student.findById(grade.studentId);

      if (!student) {
        L.error(`Cannot find student ${grade.studentId}`);
        return false;
      }

      const gradeResult = await gradeModel.save();

      student.grades.push(gradeResult._id);

      await student.save();

      return gradeResult as any;
    } catch (error) {
      L.error(error);
      return error;
    }
  }

  public async update(id: string, grade: IGrade): Promise<IGradeRet> {
    try {
      const gradeToUpdate = await Grade.findById(id);
      if (!gradeToUpdate) {
        return { status: '404' };
      }

      Object.assign(gradeToUpdate, grade);

      const ret = await gradeToUpdate.save();

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
      const result = await Grade.findByIdAndRemove({ id });
      if (!result) {
        return '404';
      }
      return '204';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default GradeService;
