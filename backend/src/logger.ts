import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { config } from './config.js';

const isDev = config.nodeEnv === 'development';

export const logger = isDev
  ? pino(
      {
        level: 'debug',
      },
      pinoPretty({
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      })
    )
  : pino({
      level: 'info',
    });
