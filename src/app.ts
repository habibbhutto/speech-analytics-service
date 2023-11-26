import express, { Application, Request, Response } from 'express';
import { evaluationRouter, docsRouter } from './routes';

function createApp() {
  const app: Application = express();

  app.use(express.json());
  app.use(evaluationRouter());
  app.use(docsRouter());

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
