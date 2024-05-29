import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import OrderService from '../service/order.service';
import { User } from '@prisma/client';

export default class OrderController {
  static create = catchAsync(async (req, res) => {
    const { id: farmerId } = req.user as User;
    const {
      productId,
      quantity,
      landSize,
      isPaid = false,
    } = req.body;
    const order = await OrderService.create({
      farmerId,
      productId,
      quantity,
      landSize,
      isPaid,
    });
    res.status(httpStatus.CREATED).send(order);
  });

  static get = catchAsync(async (req, res) => {
    const { id } = req.params;
    const order = await OrderService.get(Number(id));
    res.status(httpStatus.OK).send(order);
  });

  static update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { userId, productId, quantity, isPaid, status } = req.body;
    const order = await OrderService.update(
      Number(id),
      userId,
      productId,
      quantity,
      isPaid,
      status,
    );
    res.status(httpStatus.OK).send(order);
  });

  static delete = catchAsync(async (req, res) => {
    const { id } = req.params;
    await OrderService.delete(Number(id));
    res.status(httpStatus.NO_CONTENT).send();
  });

  static getAll = catchAsync(async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const { id, role } = req.user as User;
    const userId = ['ADMIN', 'STORE'].includes(role) ? undefined : id;
    const orders = await OrderService.getAll(
      Number(page),
      Number(limit),
      userId,
    );
    res.status(httpStatus.OK).send(orders);
  });
}
