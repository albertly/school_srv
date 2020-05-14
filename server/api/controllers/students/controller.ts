import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import StudentService from '../../services/student.service';
import { IStudent } from '../../models/student';

export class Controller {
  validationRules = (method: string) => {
    const classNameRule = check(
      'className',
      'Class name should be min 5, max 40 characters long'
    ).isLength({ min: 5, max: 40 });
    const schoolIdRule = check('schoolId', 'School id must exist').exists();

    switch (method) {
      case 'create': {
        return [
          check('className', 'Must enter class name').exists(),
          classNameRule,
          schoolIdRule,
        ];
      }
      case 'bySchoolId': {
        return [schoolIdRule];
      }
      case 'byName': {
        return [
          check('className', 'Class name must exist').exists(),
          classNameRule,
        ];
      }
      case 'byTz': {
        return [check('tz', 'Class name must exist').exists()];
      }
    }
  };

  validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      errors: extractedErrors,
    });
  };

  async byTz(req: Request, res: Response): Promise<void> {
    const tz = req.params['tz'];
    const studentService = new StudentService();
    try {
      const r = await studentService.getOne(tz);
      if (r == null) {
        res.status(404).end();
        return;
      }
      res.json(r);
    } catch (error) {
      res
        .status(500)
        .json(error)
        .end();
    }
    return;
  }

  async byClassId(req: Request, res: Response): Promise<void> {
    const classId = req.params['classId'];
    const studentService = new StudentService();

    try {
      const r = await studentService.getAllByClassId(classId);
      res.json(r);
    } catch (error) {
      res
        .status(500)
        .json(error)
        .end();
    }
  }

  create(req: Request, res: Response): void {
    const studentService = new StudentService();
    const schoolId = req.params['schoolId'];
    const classId = req.params['classId'];

    const student: IStudent = {
      classId,
      tz: req.body.tz,
      name: req.body.studentName,
    };

    studentService.add(student).then(r =>
      res
        .status(201)
        .location(`/api/v1/schools/${r.schoolId}/class/${r._id}`)
        .json(r)
    );
  }
}
export default new Controller();
