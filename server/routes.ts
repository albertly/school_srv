import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import schoolRouter from './api/controllers/schools/router';
import classRouter from './api/controllers/classes/router';
import studentRouter from './api/controllers/students/router';

export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1', studentRouter);
  app.use('/api/v1/schools', classRouter);
  app.use('/api/v1/schools', schoolRouter);
}
