import 'reflect-metadata';
import ceateApp from './app';
import dataSource from './datasource';
import logger from './utils/logger';
import config from './config';

const PORT = config.server().PORT;
const HOST = config.server().HOST;

async function bootstrap() {
  const context = {
    fileName: __filename,
    operationName: 'bootstrap',
  };

  // run forward migrations
  try {
    logger.info('initializing data source', context);
    await dataSource.initialize();
    logger.info('data source initialization completed', context);
  } catch (error) {
    logger.error('data source initialization failed', error);
    process.exit(1);
  }

  // start app server
  const app = ceateApp();

  const server = app.listen(PORT, () => {
    logger.info(`speech analysis service listening at http://${HOST}:${PORT}`, context);
  });

  // configure exit handler for graceful shutdown
  const exitHandler = () => {
    const context = {
      fileName: __filename,
      operationName: 'exitHandler',
    };

    if (server) {
      server.close(() => {
        logger.info('Server closed', context);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  // handle unexpected failures gracefully
  const unexpectedErrorHandler = (error: any) => {
    const context = {
      fileName: __filename,
      operationName: 'unexpectedErrorHandler',
    };

    logger.error(error, context);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  // configure graceful shutdown on sigterm
  // for example when k8s sends the termination signal
  process.on('SIGTERM', () => {
    const context = {
      fileName: __filename,
      operationName: 'SIGTERM',
    };

    logger.info('SIGTERM received', context);
    if (server) {
      server.close();
    }
  });
}

bootstrap();
