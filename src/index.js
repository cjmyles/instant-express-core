import auth from './auth';
import cors from './cors';
import firebase from './firebase';
import logging from './logging';
import routes from './routes';
import session from './session';

export { default as Actions } from './classes/Actions';
export { default as Controller } from './classes/Controller';
export { FirestoreRepository } from 'instant-firestore';

export { default as utils } from './utils';

const initialize = (config = {}) => {
  return {
    auth: auth(config.auth),
    cors: cors(config.cors),
    firebase: firebase(config.firebase),
    logging: logging(config.logging),
    routes: routes(config.routes),
    session: session(config.session),
  };
};

export { initialize };

export default initialize;
