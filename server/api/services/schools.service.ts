import School, { ISchool } from '../models/school';
import L from '../../common/logger';

export interface ISchoolRet {
  record?: any;
  status: string;
}

export interface ISchoolDao {
  getOne: (name: string) => Promise<ISchool | null>;
  getAll: () => Promise<ISchool[]>;
  add: (school: ISchool) => Promise<void>;
  update: (id: string, school: ISchool) => Promise<ISchoolRet>;
  delete: (id: string) => Promise<string>;
}

class SchoolsService implements ISchoolDao {
  public async getOne(name: string): Promise<ISchool | null> {
    const result = await School.findOne({ name: name });
    return result as ISchool | null;
  }

  public async getAll(): Promise<ISchool[]> {
    try {
      const result = await School.find({});
      return result ? result : ([] as ISchool[]);
    } catch (error) {
      throw error;
    }
  }

  public async add(school: ISchool): Promise<any> {
    const schoolModel = new School({
      name: school.name,
      logo: school.logo,
      motor: school.motor,
    });

    try {
      const schoolResult = await schoolModel.save();
      return schoolResult as any;
    } catch (error) {
      L.error(error);
      throw error;
    }
  }

  public async update(id: string, school: ISchool): Promise<ISchoolRet> {
    try {
      const schoolToUpdate = await School.findById(id);
      if (!schoolToUpdate) {
        return { status: '404' };
      }

      for (const f in school) {
        schoolToUpdate[f] = school[f];
      }

      const ret = await schoolToUpdate.save();

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
      const result = await School.findOne({ _id: id }, { classes: 1 });
      if (!result) {
        return '404';
      } else {
        if (result.classes.length) {
          return '400';
        }
      }
      await School.find({ _id: id }).remove();
      return '204';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default SchoolsService;
