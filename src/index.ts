import { Server } from 'http';
import app from './app';
import prisma from './client';
import logger from './config/logger';
import Config from './config/global.config';

let server: Server;
prisma.$connect().then(() => {
  logger.info('✔ Database connected');
  server = app.listen(Config.port, () => {
    logger.info(`🚀 http://localhost:${Config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
