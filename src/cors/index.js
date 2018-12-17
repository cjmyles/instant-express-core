import cors from 'cors';

export default (config = {}) => {
  return () => {
    return cors({
      ...config,
    });
  };
};
