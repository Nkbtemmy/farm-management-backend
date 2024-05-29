import { Router } from 'express';
import ProductController from '../controller/product.controller';
import auth from '../middleware/auth';

const productRoute = Router();

productRoute.get('/', ProductController.getAll);
productRoute.post('/', auth('manageStore'), ProductController.create);
productRoute.get(
  '/:productId/calculate/:landSize',
  ProductController.calculate,
);
productRoute.get('/:id', ProductController.get);
productRoute.patch('/:id', auth('manageStore'), ProductController.update);
productRoute.delete('/:id', auth('manageStore'), ProductController.delete);

export default productRoute;
