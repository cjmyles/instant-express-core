import basicAuth from 'express-basic-auth';

const ensureAuthenticated = config => {
  return basicAuth({
    users: config.users,
  });
};

export default config => {
  return ensureAuthenticated(config);
};
