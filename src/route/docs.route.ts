import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../docs';

const router = express.Router();

router.use(
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
  }),
);

export default router;
