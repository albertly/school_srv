import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import ClassService from '../../services/class.service';
import { IClass } from '../../models/classs';

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

  async byName(req: Request, res: Response): Promise<void> {
    const name = req.params['className'];
    const classService = new ClassService();
    try {
      const r = await classService.getOne(name);
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

  async bySchoolId(req: Request, res: Response): Promise<void> {
    const schoolId = req.params['schoolId'];
    const classService = new ClassService();

    try {
      const r = await classService.getAllBySchoolId(schoolId);
      res.json(r);
    } catch (error) {
      res
        .status(500)
        .json(error)
        .end();
    }
  }

  create(req: Request, res: Response): void {
    const classService = new ClassService();
    const schoolId = req.params['schoolId'];
    const classs: IClass = {
      schoolId,
      name: req.body.className,
    };

    classService.add(classs).then(r =>
      res
        .status(201)
        .location(`/api/v1/schools/${r.schoolId}/class/${r._id}`)
        .json(r)
    );
  }
}
export default new Controller();
