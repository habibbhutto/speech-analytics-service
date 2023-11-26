import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
import swaggerDefinition from '../docs/swagger.json';

function createDocsRouter() {
  const router: Router = Router();

  router.use('/api/docs', serve, setup(swaggerDefinition));
  return router;
}

export default createDocsRouter;
