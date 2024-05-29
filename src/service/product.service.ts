import { Product, Category } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';
import prisma from '../client';

export default class ProductService {
  static certainSeeds = async (seedIds: number[]) => {
    const foundSeedIds: number[] = [];
    const uniqueSeedIds = [...new Set(seedIds)];
    const results = await Promise.allSettled(
      uniqueSeedIds.map((id) =>
        prisma.product.findUnique({
          where: {
            id,
          },
        }),
      ),
    );

    results.forEach((result) => {
      if (
        result.status === 'fulfilled' &&
        result.value &&
        !foundSeedIds.includes(result.value.id)
      ) {
        foundSeedIds.push(result.value.id);
      }
    });
    return foundSeedIds;
  };

  static create = async ({
    name,
    price,
    quantity,
    maxPerAcre,
    perAcre,
    category,
    seedIds,
  }: Pick<
    Product,
    | 'name'
    | 'price'
    | 'quantity'
    | 'maxPerAcre'
    | 'perAcre'
    | 'category'
    | 'seedIds'
  >): Promise<Product> => {
    try {
      const data = {
        name,
        price,
        quantity,
        maxPerAcre,
        perAcre,
        category,
        seedIds,
      };
      if (category === 'FERTILIZER') {
        data.seedIds = await ProductService.certainSeeds(seedIds);
      }

      const createdProduct = await prisma.product.create({
        data,
      });
      return createdProduct;
    } catch (error) {
      throw error;
    }
  };

  static get = async <Key extends keyof Product>(
    id: number,
    keys: Key[] = [
      'id',
      'name',
      'price',
      'category',
      'maxPerAcre',
      'perAcre',
      'seedIds',
      'quantity',
      'createdAt',
      'updatedAt',
    ] as Key[],
  ): Promise<Pick<Product, Key> | null> => {
    return prisma.product.findUnique({
      where: { id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<Product, Key> | null>;
  };

  static update = async ({
    name,
    price,
    quantity,
    maxPerAcre,
    perAcre,
    id,
    seedIds,
  }: Pick<
    Product,
    | 'name'
    | 'price'
    | 'quantity'
    | 'maxPerAcre'
    | 'perAcre'
    | 'id'
    | 'seedIds'
  >): Promise<Product> => {
    try {
      const existProduct = await ProductService.get(id);
      if (!existProduct) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Product is not found',
        );
      }
      const data = {
        name,
        price,
        quantity,
        maxPerAcre,
        perAcre,
        seedIds: existProduct.seedIds,
      };
      if (existProduct.category === 'FERTILIZER' && seedIds.length) {
        data.seedIds = await ProductService.certainSeeds(seedIds);
      }
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };

  static delete = async (id: number): Promise<void> => {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  };

  static getAll = async <Key extends keyof Product>(
    page: number,
    limit: number = 5,
    keys: Key[] = [
      'id',
      'name',
      'price',
      'category',
      'maxPerAcre',
      'perAcre',
      'seedIds',
      'quantity',
      'createdAt',
      'updatedAt',
    ] as Key[],
  ): Promise<Pick<Product, Key>[]> => {
    return prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<Product, Key>[]>;
  };

  static calculateProductQuantity = async (
    landSize: number,
    productId: number,
  ) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Product is not found',
      );
    }

    const { maxPerAcre, perAcre } = product;

    const maxProductQuantity = maxPerAcre * Math.ceil(landSize);

    const quantity = Math.min(maxProductQuantity, landSize * perAcre);

    return {
      quantity,
      maxQuantity: maxProductQuantity,
      price: quantity * product.price,
    };
  };
}
