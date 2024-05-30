import cluster from 'cluster';
import os from 'os';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import router from './app';
import prisma from './client';
import logger from './config/logger';
import Config from './config/global.config';

dotenv.config();
const app = express();
const numCPU = os.cpus().length;

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV != 'production') app.use(morgan('dev'));
app.use(router);

export async function startServer() {
  try {
    await prisma.$connect();
    logger.info('✔ Database connected');
    const server = app.listen(Config.port, () => {
      logger.info(`🚀 http://localhost:${Config.port}`);
    });
    return server;
  } catch (error: any) {
    logger.error('Error starting the server:', error.message);
    throw error;
  }
}

export async function stopServer(server: any) {
  try {
    await prisma.$disconnect();
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info('Server has been stopped');
        resolve();
      });
    });
  } catch (error: any) {
    logger.error('Error stopping the server:', error.message);
    throw error;
  }
}

const exitHandler = (server: any) => {
  if (server) {
    stopServer(server).then(() => process.exit(1));
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown, server: any) => {
  logger.error(error);
  exitHandler(server);
};

// Utilizing clusters
if (cluster.isPrimary && process.env.NODE_ENV == 'production') {
  const workers: any = [];
  for (let i = 0; i < numCPU; i += 1) {
    const worker = cluster.fork();
    workers.push(worker);
    worker.on('exit', (code, signal) => {
      logger.info(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
      const index = workers.indexOf(worker);
      if (index !== -1) {
        workers.splice(index, 1);
      }
      if (workers.length === 0) {
        process.exit(0);
      }
    });
  }
} else {
  const server = startServer();

  process.on('uncaughtException', (error) => unexpectedErrorHandler(error, server));
  process.on('unhandledRejection', (error) => unexpectedErrorHandler(error, server));
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received');
    if (server) {
      (await server).close();
    }
  });
}

export default app;
