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
];

const devRoutes = [
  {
    path: '/api-docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(`/api${route.path}`, route.route);
});

if (Config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
