import express from 'express';

import controller from './controller';

export default express
  .Router()
  .post(
    '/:schoolId/classes',
    controller.validationRules('create'),
    controller.validate,
    controller.create
  )
  .get(
    '/:schoolId/classes',
    controller.validationRules('bySchoolId'),
    controller.validate,
    controller.bySchoolId
  );
