import path from 'path';
import admin from 'firebase-admin';
// import auth from './auth';
import firestore from './firestore';
// import storage from './storage';

const initializeApp = config => {
  if (!config.serviceAccountKey) {
    throw new Error(
      'config.firebase.serviceAccountKey required to initialize Firebase app.'
    );
  }
  if (config.serviceAccountKey) {
    const serviceAccountKey =
      typeof config.serviceAccountKey === 'string'
        ? require(path.join(process.cwd(), config.serviceAccountKey))
        : config.serviceAccountKey;
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });
    return app;
  }
};

export default (config = {}) => {
  return () => {
    const app = initializeApp(config);
    if (app) {
      return {
        app,
        // auth: auth(config),
        db: firestore(config),
        // storage: storage(config),
      };
    }
  };
};
