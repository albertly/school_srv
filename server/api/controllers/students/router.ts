import express from 'express';

import controller from './controller';

export default express
  .Router()
  .post(
    '/schools/:schoolId/classes/:classId/students',
    controller.validationRules('create'),
    controller.validate,
    controller.create
  )
  .get(
    '/classes/:classId/students',
    controller.validationRules('bySchoolId'),
    controller.validate,
    controller.byClassId
  )
  .get(
    '/students/:tz',
    controller.validationRules('byTz'),
    controller.validate,
    controller.byTz
  );
