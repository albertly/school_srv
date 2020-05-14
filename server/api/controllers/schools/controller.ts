import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import SchoolsService from '../../services/schools.service';
import { ISchool } from '../../models/school';

export class Controller {
  validationRules = (method: string) => {
    const schoolNameRule = check(
      'schoolName',
      'School name should be min 5, max 20 characters long'
    ).isLength({ min: 5, max: 20 });
    switch (method) {
      case 'create': {
        return [
          check('name', 'School name its too short').exists(),
          schoolNameRule,
          check('name', 'School name too long').isLength({ min: 5 }),
          check('logo', 'Logo doesnt exist').exists(),
          check('motor', 'Motor doesnt exist').exists(),
        ];
      }
      case 'byName': {
        return [
          check('schoolName', 'School name its too short').exists(),
          schoolNameRule,
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
    const name = req.params['schoolName'];
    const schoolService = new SchoolsService();
    try {
      const r = await schoolService.getOne(name);
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

  async all(req: Request, res: Response): Promise<void> {
    const schoolService = new SchoolsService();

    try {
      const r = await schoolService.getAll();
      res.json(r);
    } catch (error) {
      res
        .status(500)
        .json(error)
        .end();
    }
  }

  create(req: Request, res: Response): void {
    const schoolService = new SchoolsService();
    const school: ISchool = {
      name: req.body.name,
      logo: req.body.logo,
      motor: req.body.motor,
    };
    schoolService.add(school).then(r =>
      res
        .status(201)
        .location(`/api/v1/schools/${r.id}`)
        .json(r)
    );
  }
}
export default new Controller();
