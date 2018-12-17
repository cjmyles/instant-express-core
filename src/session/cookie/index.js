import session from 'cookie-session';

export default (config = {}) => {
  return () => {
    console.log('Using session type: cookie');
    return session(config);
  };
};
