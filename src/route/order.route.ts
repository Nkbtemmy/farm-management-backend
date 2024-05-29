import { Router } from 'express';
import OrderController from '../controller/order.controller';
import auth from '../middleware/auth';

const orderRoute = Router();

orderRoute.get('/', auth(), OrderController.getAll);
orderRoute.post('/', auth('placeOrder'), OrderController.create);
orderRoute.get('/:id', auth(), OrderController.get);
orderRoute.patch(
  '/:id',
  auth('manageOrder'),
  OrderController.update,
);
orderRoute.delete('/:id', auth('manageOrder'), OrderController.delete);

export default orderRoute;
