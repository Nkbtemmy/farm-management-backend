// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import prisma from './client';
// import logger from './config/logger';
// import Config from './config/global.config';
// import router from './app';

// dotenv.config();
// const app = express();

// app.use(express.urlencoded({ extended: true, limit: '100mb' }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(express.json());
// app.use(cors());
// if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
// app.use(router);

// let server: any;

// export async function startServer() {
//   try {
//     await prisma.$connect();
//     logger.info('✔ Database connected');
//     server = app.listen(Config.port, () => {
//       logger.info(`🚀 http://localhost:${Config.port}`);
//     });
//     return server;
//   } catch (error: any) {
//     logger.error('Error starting the server:', error.message);
//     throw error;
//   }
// }

// export async function stopServer() {
//   try {
//     await prisma.$disconnect();
//     if (server) {
//       await new Promise<void>((resolve, reject) => {
//         server.close((err: any) => {
//           if (err) {
//             logger.error('Error stopping the server:', err.message);
//             reject(err);
//           } else {
//             logger.info('Server has been stopped');
//             resolve();
//           }
//         });
//       });
//     }
//   } catch (error: any) {
//     logger.error('Error stopping the server:', error.message);
//     throw error;
//   }
// }

// if (require.main === module) {
//   startServer();
// }

// export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import prisma from './client';
import logger from './config/logger';
import Config from './config/global.config';
import router from './app';
import cluster from 'cluster';
import os from 'os';

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(router);

let server: any;

export async function startServer() {
  try {
    await prisma.$connect();
    logger.info('✔ Database connected');
    server = app.listen(Config.port, () => {
      logger.info(`🚀 http://localhost:${Config.port}`);
    });
    return server;
  } catch (error: any) {
    logger.error('Error starting the server:', error.message);
    throw error;
  }
}

export async function stopServer() {
  try {
    await prisma.$disconnect();
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err: any) => {
          if (err) {
            logger.error('Error stopping the server:', err.message);
            reject(err);
          } else {
            logger.info('Server has been stopped');
            resolve();
          }
        });
      });
    }
  } catch (error: any) {
    logger.error('Error stopping the server:', error.message);
    throw error;
  }
}

if (process.env.NODE_ENV === 'production' && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died. Forking a new worker.`);
    cluster.fork();
  });
} else {
  if (require.main === module) {
    startServer();
  }
  // startServer();
}

export default app;
