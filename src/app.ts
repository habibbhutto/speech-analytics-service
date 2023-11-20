import express, { Application, Request, Response } from 'express';
import { authRouter, tasksRouter, docsRouter } from './routes';
import { TaskService } from './services';

function createApp(taskService: TaskService = new TaskService()) {
  const app: Application = express();

  app.use(express.json());
  app.use(authRouter());
  app.use(docsRouter());
  app.use(tasksRouter(taskService));

  app.get('/', (_req: Request, res: Response) => {
    res.redirect('/api/docs');
  });

  app.get('/live', (_req: Request, res: Response) => {
    res.json({ status: 'Ok' });
    res.end();
  });

  return app;
}

export default createApp;
