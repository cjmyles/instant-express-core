module.exports = (config = {}) => {
  const type = config.type || 'express';
  const session = require(`./${type}`).default; // eslint-disable-line global-require
  return session(config.options);
};
