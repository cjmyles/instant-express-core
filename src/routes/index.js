import fs from 'fs';
import path from 'path';
import glob from 'glob';
import express from 'express';

const getDirectories = srcpath => {
  return fs
    .readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
};

const configureVersions = (router, routesBase, routesPath, prefix) => {
  const versionPaths = getDirectories(routesBase);
  versionPaths.forEach(filePath => {
    const version = path.relative(routesBase, filePath);
    const versionPrefix = prefix ? `${prefix}/${version}` : version;
    configureRoutes(router, path.join(filePath, routesPath), versionPrefix);
  });
};

const configureRoutes = (router, routesPath, prefix) => {
  const files = glob.sync(`${path.join(process.cwd(), routesPath)}/*.js`);
  if (!files || files.length === 0) {
    console.error(`No API routes detected in ${routesPath}`);
  } else {
    files.forEach(filePath => {
      const basename = path.basename(filePath, '.js');
      const route = prefix ? `/${prefix}/${basename}` : `/${basename}`;
      const file = require(path.join(process.cwd(), routesPath, basename));
      console.info(`Adding route ${route}`);
      router.use(route, file);
    });
  }
};

const autoConfigureRoutes = (router, config) => {
  // Routes path provided
  if (config.base) {
    configureVersions(router, config.base, config.path, config.prefix);
  }
  // Versioned routes
  else {
    configureRoutes(router, config.path, config.prefix);
  }
  return router;
};

export default (config = {}) => {
  return () => {
    const router = express.Router();
    // Auto-configure routes
    autoConfigureRoutes(router, config);
    return router;
  };
};
