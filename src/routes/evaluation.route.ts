import { Router } from 'express';
import evaluationController from '../controllers/evaluation.controller';

function createEvaluationRouter() {
  const router: Router = Router();

  router.get('/api/evaluation', async (req, res) =>
    evaluationController.getSpeechEvaluation(req, res)
  );

  return router;
}

export default createEvaluationRouter;
