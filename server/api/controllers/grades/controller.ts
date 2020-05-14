import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

import GradeService from '../../services/grade.service';
import { IGrade } from '../../models/grade';

export class Controller {
  validationRules = (method: string) => {

    switch (method) {
      case 'create': {
        return [          
          check('studentId', 'Studen Id must exist').exists(),
          check('subject', 'Subject must exist').exists(),
          check('year','Year must exist').exists(),
          check('year','Year must be between 2010 and 2030').isInt({gt: 2010, lt: 2030}),                    
          check('first', 'First mark must be between 0 and 100').isInt({gt: 0, lt: 100}),
          check('second', 'Second mark be between 0 and 100').isInt({gt: 0, lt: 100})
          
        ];
      }
      case 'byStudentId': {
        return [ check('studentId', 'Studen Id must exist').exists(),];
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


  async byStudentId(req: Request, res: Response): Promise<void> {
    const studentId = req.params['studentId'];
    const gradeService = new GradeService();

    try {
      const r = await gradeService.getAllByStudentId(studentId);
      res.json(r);
    } catch (error) {
      res
        .status(500)
        .json(error)
        .end();
    }
  }

  create(req: Request, res: Response): void {
    const gradeService = new GradeService();
    const studentId = req.params['studentId'];

    const grade: IGrade = {
      studentId,
      subject: req.body.subject,
      year: req.body.year,
      first: req.body.first,
      second: req.body.second
    };

    gradeService.add(grade).then(r =>
      res
        .status(201)
      // .location(`/api/v1/schools/${r.schoolId}/class/${r._id}`)   // todo
        .json(r)
    );
  }
}

export default new Controller();
