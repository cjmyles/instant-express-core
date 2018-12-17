import morgan from 'morgan';
import winston from 'winston';

const logRequests = config => {
  const logger = morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev');
  return logger;
};

const logOutput = config => {
  let transports = [
    new winston.transports.Console({ format: winston.format.simple() }),
  ];

  if (process.env.NODE_ENV === 'production') {
    if (config.error && config.error.filename) {
      transports.push(
        new winston.transports.File({
          filename: config.error.filename,
          level: 'error',
        })
      );
    }
    if (config.combined && config.combined.filename) {
      transports.push(
        new winston.transports.File({ filename: config.combined.filename })
      );
    }
  }

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports,
  });

  return logger;
};

export default (config = {}) => {
  return type => {
    return type === 'requests' ? logRequests(config) : logOutput(config);
  };
};
