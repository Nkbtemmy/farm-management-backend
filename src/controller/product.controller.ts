import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ProductService from '../service/product.service';

export default class ProductController {
  static create = catchAsync(async (req, res) => {
    const {
      name,
      price,
      quantity,
      maxPerAcre,
      perAcre,
      category,
      seedIds,
    } = req.body;
    const order = await ProductService.create({
      name,
      price,
      quantity,
      maxPerAcre,
      perAcre,
      category,
      seedIds,
    });
    res.status(httpStatus.CREATED).send(order);
  });

  static get = catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await ProductService.get(Number(id));
    res.status(httpStatus.OK).send(order);
  });

  static update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const {
      name,
      price,
      quantity,
      maxPerAcre,
      perAcre,
      seedIds = [],
    } = req.body;
    const order = await ProductService.update({
      id: Number(id),
      name,
      price,
      quantity,
      maxPerAcre,
      perAcre,
      seedIds,
    });
    res.status(httpStatus.OK).send(order);
  });

  static delete = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ProductService.delete(Number(id));
    res.status(httpStatus.NO_CONTENT).send();
  });

  static getAll = catchAsync(async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const orders = await ProductService.getAll(
      Number(page),
      Number(limit),
    );
    res.status(httpStatus.OK).send(orders);
  });

  static calculate = catchAsync(async (req, res) => {
    const { productId, landSize } = req.params;
    const results = await ProductService.calculateProductQuantity(
      Number(landSize),
      Number(productId),
    );
    return res.status(httpStatus.OK).send(results);
  });
}
