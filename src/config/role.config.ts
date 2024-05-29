import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['placeOrder'],
  [Role.STORE]: ['manageOrder', 'manageStore', 'manageUser'],
  [Role.ADMIN]: ['manageOrder', 'manageStore'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
