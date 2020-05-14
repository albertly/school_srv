import Classs, { IClass } from '../models/classs';
import School, { ISchool } from '../models/school';
import L from '../../common/logger';

export interface IClassRet {
  record?: any;
  status: string;
}

export interface IClassDao {
  getOne: (id: string) => Promise<IClass | null>;
  getOneByName: (id: string) => Promise<IClass | null>;
  getAllBySchoolId: (schoolId: string) => Promise<any>;
  add: (Classs: IClass) => Promise<void>;
  update: (id: string, classs: IClass) => Promise<IClassRet>;
  delete: (id: string) => Promise<string>;
}

class ClassService implements IClassDao {
  public async getOne(id: string): Promise<IClass | null> {
    const result = await Classs.findById(id);
    return result as IClass | null;
  }

  public async getOneByName(name: string): Promise<IClass | null> {
    const result = await Classs.find({ name });
    return result[0] as IClass | null;
  }

  public async getAllBySchoolId(schoolId: string): Promise<any> {
    try {
      const classes = await School.findById(schoolId).populate('classes');
      return classes;
    } catch (err) {
      throw err;
    }
  }

  public async add(classs: IClass): Promise<any> {
    const ClassModel = new Classs({
      name: classs.name,
      schoolId: classs.schoolId,
    });

    try {
      const school = await School.findById(classs.schoolId);

      if (!school) {
        L.error(`Cannot find school ${classs.schoolId}`);
        return false;
      }

      const classResult = await ClassModel.save();

      school.classes.push(classResult._id);

      await school.save();

      return classResult as any;
    } catch (error) {
      L.error(error);
      return error;
    }
  }

  public async update(id: string, classs: IClass): Promise<IClassRet> {
    try {
      const classsToUpdate = await Classs.findById(id);
      if (!classsToUpdate) {
        return { status: '404' };
      }

      for (const f in classs) {
        classsToUpdate[f] = classs[f];
      }

      const ret = await classsToUpdate.save();

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
      const result = await Classs.findOne({ _id: id }, { students: 1 });
      if (!result) {
        return '404';
      } else {
        if (result.students.length) {
          return '400';
        }
      }
      await Classs.find({ _id: id }).remove();
      return '204';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ClassService;
