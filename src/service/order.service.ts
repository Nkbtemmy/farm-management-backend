import { Order, OrderStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';
import prisma from '../client';

export default class OrderService {
  static create = async ({
    farmerId,
    productId,
    quantity,
    landSize,
    isPaid = false,
  }: Pick<
    Order,
    'farmerId' | 'productId' | 'quantity' | 'landSize' | 'isPaid'
  >): Promise<Order> => {
    try {
      const farmer = await prisma.user.findUnique({
        where: {
          id: farmerId,
        },
      });
      if (!farmer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Farmer not found');
      }
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
      }
      const createdOrder = await prisma.order.create({
        data: {
          farmerId,
          productId,
          quantity,
          landSize,
          isPaid,
        },
      });
      return createdOrder;
    } catch (error) {
      throw error;
    }
  };

  static get = async <Key extends keyof Order>(
    id: number,
    keys: Key[] = [
      'id',
      'farmerId',
      'productId',
      'status',
      'quantity',
      'createdAt',
      'updatedAt',
    ] as Key[],
  ): Promise<Pick<Order, Key> | null> => {
    return prisma.order.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<Order, Key> | null>;
  };

  static update = async (
    id: number,
    farmerId: number,
    productId: number,
    quantity: number,
    isPaid = false,
    status: OrderStatus,
  ): Promise<Order> => {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          farmerId,
          productId,
          quantity,
          isPaid,
          status,
        },
        include: {
          farmer: true,
          product: true,
        }
      });
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  };

  static delete = async (id: number): Promise<Order> => {
    try {
      const deletedOrder = await prisma.order.delete({
        where: { id },
      });
      return deletedOrder;
    } catch (error) {
      throw error;
    }
  };

  static getAll = async (
    page: number = 1,
    limit: number = 5,
    farmerId?: number,
  ): Promise<Order[]> => {
    const skip = (page - 1) * limit;
    let where: Record<string, any> = {};
    if (farmerId) {
      where.farmerId = farmerId;
    }
    const orders = await prisma.order.findMany({
      skip,
      take: limit,
      where,
      include: {
        farmer: true,
        product: true,
      },
    });

    return orders.map((order) => ({
      ...order,
      farmer: {
        ...order.farmer,
        password: undefined,
      },
    }));
  };
}
