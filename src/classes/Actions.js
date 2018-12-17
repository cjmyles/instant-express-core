import Default from './Default';
import HttpStatus from 'http-status-codes';
import serializeError from 'serialize-error';
import { param, query, body, validationResult } from 'express-validator/check';
import { compose } from 'compose-middleware';

export default class Actions extends Default {
  constructor(controller) {
    super();
    Default.bind(this, [
      'create',
      'createMany',
      'find',
      'findOne',
      'findById',
      'update',
      'updateOrCreate',
      'delete',
    ]);
    this.controller = controller;
  }

  static get validator() {
    return { param, query, body };
  }

  static validate(validation, req, res, next) {
    const composed = Array.isArray(validation)
      ? compose(validation)
      : validation;
    composed(req, res, () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        Actions.send(res).error({ errors: errors.array() });
      } else {
        next();
      }
    });
  }

  static send(res) {
    return {
      ok: payload => {
        res.status(HttpStatus.OK).send(payload);
      },
      noContent: () => {
        res.status(HttpStatus.NO_CONTENT).send();
      },
      notFound: () => {
        res.status(HttpStatus.NOT_FOUND).send();
      },
      error: error => {
        console.error(error);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(serializeError(error));
      },
    };
  }

  async create(req, res, next) {
    try {
      let payload = req.params.id
        ? await this.controller.createWithId(req.params.id, req.body)
        : await this.controller.create(req.body);
      Actions.send(res).ok(payload);
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async createMany(req, res, next) {
    try {
      const payload = await this.controller.createMany(req.body);
      Actions.send(res).ok(payload);
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async find(req, res, next) {
    try {
      const payload = await this.controller.find(req.query);
      Actions.send(res).ok(payload);
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const payload = await this.controller.findOne(req.query);
      payload ? Actions.send(res).ok(payload) : Actions.send(res).notFound();
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async findById(req, res, next) {
    try {
      const payload = await this.controller.findById(req.params.id);
      payload ? Actions.send(res).ok(payload) : Actions.send(res).notFound();
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async update(req, res, next) {
    try {
      const payload = await this.controller.update(req.params.id, req.body);
      payload ? Actions.send(res).ok(payload) : Actions.send(res).notFound();
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async updateOrCreate(req, res, next) {
    try {
      const payload = await this.controller.updateOrCreate(req.query, req.body);
      payload ? Actions.send(res).ok(payload) : Actions.send(res).notFound();
    } catch (error) {
      Actions.send(res).error(error);
    }
  }

  async delete(req, res, next) {
    try {
      const payload = await this.controller.delete(req.params.id);
      payload ? Actions.send(res).ok(payload) : Actions.send(res).notFound();
    } catch (error) {
      Actions.send(res).error(error);
    }
  }
}
