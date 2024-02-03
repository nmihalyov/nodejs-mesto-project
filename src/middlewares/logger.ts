import expressWinston from 'express-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';

const commonOptions = {
  datePattern: 'DD-MM-YYYY',
  maxFiles: '14d',
  zippedArchive: true,
  format: winston.format.json(),
};

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/request-%DATE%.log',
      ...commonOptions,
    }),
  ],
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      ...commonOptions,
    }),
  ],
});
