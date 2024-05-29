import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Config from '../config/global.config';

export const errorConverter: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let { statusCode, message } = err;
  if (Config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(Config.env === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};
