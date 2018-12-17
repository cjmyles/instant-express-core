# Instant Express Core

Core [`instant-express`](https://github.com/cjmyles/instant-express) functionality, including routing, authentication, session, firebase connectivity and utilities.

**Please note:** this module contains some code that will assist with the creation of a Firebase Functions application. However, you can easily use this module for _any_ Express app, and other database/hosting drivers will be added in the future.

## Features

- Basic Authentication
- CORS Middleware
- Winston Logging
- Automatic Routing
- Session
- Firebase Admin initialisation
- Generic Actions and Controller classes that can be easily extented to enable simple CRUD routing operations
- Firebase Firestore specific Repository class to enable retrieval of Firestore collections and documents

## Sample Usage

```javascript
const express = require('express');
const InstantAPI = require('instant-express-api');

const app = express();
// const config = ...
const instant = InstantAPI.initialize(config);

// Create our app
const app = express();

// Initialise InstantAPI
const instant = InstantAPI.initialize(config);

// Set up CORS
app.use(instant.cors());

// Set up auth
app.use(instant.auth());

// Enable logging
app.logger = instant.logging();
// or, `logger = instant.logging();` if you want a global variable

// Set up firebase
app.firebase = instant.firebase();
// or, `firebase = instant.firebase();` if you want a global variable

// Set up the routes
app.use(instant.routes());
```

## Configuration

Some features require a configuration object. Options should be passed in on initialisation as a json object. I recommend using something like [config](https://www.npmjs.com/package/config) to access your configuration settings, but you could equally implement something simpler.

### Example

```json
"auth": {
    "method": "basic",
    "users": {
        "craig": "pa55w0rd",
        "admin": "supersecret",
    }
},
"logging": {
    "error": {
        "filename": "error.log"
    },
    "combined": {
        "filename": "combined.log"
    }
},
"routes": {
    "path": "api/routes"
},
```

## Authentication

### Basic

Utilises [Express Basic Auth](https://www.npmjs.com/package/express-basic-auth).

#### Sample Usage

```javascript
app.use(
  instant.auth({
    method: 'basic',
    users: {
      craig: 'pa55w0rd',
      admin: 'supersecret',
    },
  })
);
```

#### Options

| Name     | Type     | Description                       | Options |
| :------- | :------- | :-------------------------------- | :------ |
| `method` | `string` | Authentication type               | "basic" |
| `users`  | `object` | username:password key value pairs |

## CORS

Utilises [CORS](https://www.npmjs.com/package/cors).

### Sample usage

```javascript
app.use(instant.cors());
```

### Options

N/A

## Logging

Utilises [Winston](https://www.npmjs.com/package/winston).

### Sample usage

```javascript
app.logger = instant.logging({
  error: {
    filename: 'error.log',
  },
  combined: {
    filename: 'combined.log',
  },
});
```

#### Options

| Name                | Type     | Description                  | Options |
| :------------------ | :------- | :--------------------------- | :------ |
| `error.filename`    | `string` | File to log errors to        |
| `combined.filename` | `string` | File to log combined logs to |

## Routes

Autoconfigure API routes (rather than manually importing each routes file one by one). Can be configured to utilise routes files from one directory (e.g. `./api/routes/`), or within base directories (useful for versioned routes such as `/api/v1.0/routes`).

For example, we can expose a GET method on `/api/test/` assuming we've have `./api/routes/test.js` that looks something like this:

```js
// ./api/routes/test.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ testing: 123 });
});

module.exports = router;
```

### Sample usage

```javascript
app.use(
  instant.routes({
    path: 'api/routes',
  })
);
```

#### Options

| Name              | Type     | Description                                    | Options |
| :---------------- | :------- | :--------------------------------------------- | :------ |
| `base` (optional) | `string` | Location of base API directory, e.g. `api`     |
| `path`            | `string` | Location of API routes directory, e.g `routes` |
| `prefix`          | `string` | Prefix to apply to routes, e.g. `api`          |

**Note:** you can have multiple named directories that sit between the base and path, all of which will be automatically parsed, for example `./api/v1.0/routes/test.js` and `./api/v2.0/routes/test.js`.

## Session

Utilises [Express Session](https://www.npmjs.com/package/express-session) or [Cookie Session](https://www.npmjs.com/package/cookie-session).

### Sample usage

```javascript
app.use(instant.session({
  "type": "express",
  "options": {
    "secret": "super-secret-phrase",
    "resave": false,
    "saveUninitialized": false,
    "cookie": {}
  }
});
```

#### Options

| Name      | Type     | Description                                                         | Options             |
| :-------- | :------- | :------------------------------------------------------------------ | :------------------ |
| `type`    | `string` | Session type                                                        | `express`, `cookie` |
| `options` | `object` | Module specific options (see specific package for more information) |

## Firebase

Initialises our Firebase app and exposes the following services:

- Auth (coming soon)
- Firestore
- Storage (coming soon)

### Sample usage

```javascript
app.use(instant.firebase({
  'serviceAccountKey': 'config/serviceAccountKey.json'
});
```

#### Options

| Name                | Type     | Description                                                                                         | Options |
| :------------------ | :------- | :-------------------------------------------------------------------------------------------------- | :------ |
| `serviceAccountKey` | `string` | Location of Service Account Key JSON file (please see https://firebase.google.com/docs/admin/setup) |

## Classes

Writing entity specific routes can be time consuming, especially when you have a lot of routing code replicated across multiple entities performing the same task. For example, imagine you have two API routes, `/api/clients` and `/api/users` that both have create, find all, find one, find by id, update and delete operations. The majority of the code will be same across both routes, performing functions such as fetching from the database, testing for the existence of a returned record or document, and handling the response.

To alleviate this issue, this module includes classes that can perfom these basic tasks, which you can extend from for your own needs. However, this would assume the following code structure:

```
/api
    /routes
        /test.js
    /actions
        /test.js
    /controllers
        /test.js
    /repositories
        /test.js
```

- A `routes` method defines which `actions` method to execute for a given request.
- An `actions` method defines which `controller` method to execute.
- A `controller` method defines which `repository` method to execute.
- A `repository` method communicates with a database and returns the results.

Data is passed back from the repository to the action which handles the response. This might seem over elaborate, but provides a clear separation of concerns between the tasks being performed. It also provides the following benefits:

- It would be relatively simple to swap one `repository` out for another. For example, as long as the same methods existed, we could swap between using a Mongo db and Firestore.
- Although an `actions` could communicate directly with `respositories`, `controllers` enable us to perform calculations or operations on the results before they are returned. This means that `controllers` could reference other `controllers` and the calculations or operations happen in one place. It also separates what might be send in a request from the required inputs for retrieving or calculating data.

**Note:** although not specifically referenced here, I would suggest also having an `adapters` directory for handling operations to other 3rd party APIs (such as Twilio or Sendgrid), as well as a `helpers` directory for common entity specific utilities such as validators or formatters.

The following operations are currently supported:

- `create`
- `createMany`
- `find`
- `findOne`
- `findById`
- `update`
- `updateOrCreate`
- `delete`

### Actions

| Method           | Expected request           | Type     | Description                               | Example                  |
| :--------------- | :------------------------- | :------- | :---------------------------------------- | :----------------------- |
| `create`         | `req.body`                 | `object` | Attributes to create document with        | { "name": "Craig" }      |
|                  | `req.params.id` (optional) | `string` | Id to create document with                | "00001"                  |
| `find`           | `req.query`                | `string` | Search query                              | "name=Craig"             |
| `findOne`        | `req.query`                | `string` | Search query                              | "name=Craig"             |
| `findById`       | `req.params.id`            | `string` | Document id                               | "00001"                  |
| `update`         | `req.body`                 | `object` | Attributes to update document with        | { "location": "Sydney" } |
| `updateOrCreate` | `req.query`                | `string` | Search query                              | "name=Craig"             |
|                  | `req.body`                 | `object` | Attributes to update/create document with | { "location": "Sydney" } |
| `delete`         | `req.params.id`            | `string` | Document id                               | "00001"                  |

### Sample usage

```js
// ./api/routes/clients.js
const express = require('express');
const actions = require('../actions/clients');

const router = express.Router();

router.post('/', actions.create);
router.post('/:id', actions.create);
router.get('/', actions.find);
router.get('/:id', actions.findById);
router.put('/:id', actions.update);
router.delete('/:id', actions.delete);

module.exports = router;
```

```js
// ./api/actions/clients.js
const Actions = require('instant-express-api').Actions;
const controller = require('../controllers/clients');
// const HttpStatusCodes = require('http-status-codes');

class Clients extends Actions {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  //
  // e.g.
  //   async create(req, res, next) {
  //     try {
  //       let response = req.params.id
  //         ? await this.controller.createWithId(req.params.id, req.body)
  //         : await this.controller.create(req.body);
  //       res.status(HttpStatusCodes.OK).send(response);
  //     } catch (error) {
  //       res.status(HttpStatusCodes.OK).send(error);
  //     }
  //   }
  //
  // Custom methods here...
  // Note: we have to bind the method to `this`
  //
  // e.g.
  //   constructor(controller) {
  //     this.custom = this.custom.bind(this);
  //     super(controller);
  //   }
  //
  //   async custom(req, res, next) {
  //     try {
  //       let response = await this.controller.custom(req.params.id)
  //       res.status(HttpStatusCodes.OK).send(response);
  //     } catch (error) {
  //       res.status(HttpStatusCodes.OK).send(error);
  //     }
  //   }
}

module.exports = new Clients(controller);
```

```js
// api/controllers/clients.js
const Controller = require('instant-express-api').Controller;
const repository = require('../repositories/clients');

class Clients extends Controller {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  //
  // e.g.
  // async create(attributes) {
  //     try {
  //       return await this.repository.create(attributes);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
  //
  // Custom methods here...
  // Note: we have to bind the method to `this`
  //
  // e.g.
  //   constructor(repository) {
  //     this.custom = this.custom.bind(this);
  //     super(repository);
  //   }
  //
  //   async custom(id) {
  //     try {
  //       return await this.repository.custom(id)
  //     } catch (error) {
  //       res.status(HttpStatusCodes.OK).send(error);
  //     }
  //   }
}

module.exports = new Clients(repository);
```

```js
// api/repositories/clients.js
const FirestoreRepository = require('instant-express-api').FirestoreRepository;
const firebase = require('../../firebase'); // Your firestore initialisation script (see below)

class Clients extends FirestoreRepository {
  // Includes the following methods by default:
  // create, createWithId, createMany, find, findOne, findById, update, updateOrCreate and delete
  //
  // e.g.
  //   async create(attributes) {
  //     try {
  //       const ref = await this.db.collection(this.collection).add(attributes);
  //       if (ref.id) {
  //         return await this.findById(ref.id);
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
  //
  // Custom methods here...
  // Note: we have to bind the method to `this`
  //
  // e.g.
  //   constructor(db, collection) {
  //     this.custom = this.custom.bind(this);
  //     super(db, collection);
  //   }
  //
  //   async custom(id) {
  //     try {
  //       return await this.db.collection(this.collection).get(id);
  //     } catch (error) {
  //       res.status(HttpStatusCodes.OK).send(error);
  //     }
  //   }
}

module.exports = new Clients(firebase.db, 'clients');
```

```js
// firebase.js - see https://firebase.google.com/docs/admin/setup
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

module.exports = { db };
```

## Running Tests

**Please note:** tests haven't yet been implemented (https://auth0.com/blog/developing-npm-packages/).

To run the tests, clone the repository and install the dependencies:

```bash
git clone https://github.com/JSJInvestments/instant-express-api.git
cd instant-express-api && npm i
npm run test
```

## License

[MIT](LICENSE)
