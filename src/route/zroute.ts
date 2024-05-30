import express from 'express';
import docsRoute from './docs.route';
import authRoute from './auth.route';
import Config from '../config/global.config';
import productRoute from './product.route';
import orderRoute from './order.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Farm Backend!');
});

const defaultRoutes = [
  {
    path: '/api-docs',
    route: docsRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/api-docs',
    route: docsRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(`/api/v1${route.path}`, route.route);
});



export default router;
