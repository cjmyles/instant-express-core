import session from 'express-session';

export default (config = {}) => {
  return () => {
    console.log('Using session type: express');
    return session(config);
  };
};
