import express from 'express';

import controller from './controller';

export default express
  .Router()
  .post(
    '/',
    controller.validationRules('create'),
    controller.validate,
    controller.create
  )
  .get(
    '/:schoolName',
    controller.validationRules('byName'),
    controller.validate,
    controller.byName
  )
  .get('/', controller.all);
