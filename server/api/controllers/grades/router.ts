import express from 'express';

import controller from './controller';

export default express
  .Router()
  .post(
    '/grades/:studentId',
    controller.validationRules('create'),
    controller.validate,
    controller.create
  )
  .get(
    '/grades/:studentId/',
    controller.validationRules('byStudentId'),
    controller.validate,
    controller.byStudentId
  )

