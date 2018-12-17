const loadAuthentication = config => {
  const method = config.method || 'none';
  console.log(`Using auth method: ${method}`);
  if (method === 'none') {
    return (req, res, next) => {
      next();
    };
  }
  const instantAuth = require(`./${method}`); // eslint-disable-line global-require
  return instantAuth(config);
};

module.exports = (config = {}) => {
  return () => loadAuthentication(config);
};
