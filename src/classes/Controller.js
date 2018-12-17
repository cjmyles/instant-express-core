import Default from './Default';

export default class Controller extends Default {
  constructor(repository) {
    super();
    Default.bind(this, [
      'create',
      'createWithId',
      'createMany',
      'find',
      'findOne',
      'findById',
      'update',
      'updateOrCreate',
      'delete',
    ]);
    this.repository = repository;
  }

  async create(attributes) {
    try {
      return await this.repository.create(attributes);
    } catch (error) {
      throw error;
    }
  }

  async createWithId(id, attributes) {
    try {
      return await this.repository.createWithId(id, attributes);
    } catch (error) {
      throw error;
    }
  }

  async createMany(arr) {
    try {
      return await this.repository.createMany(arr);
    } catch (error) {
      throw error;
    }
  }

  async find(query, options) {
    try {
      return await this.repository.find(query, options);
    } catch (error) {
      throw error;
    }
  }

  async findOne(query, options) {
    try {
      return await this.repository.findOne(query, options);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, options) {
    try {
      return await this.repository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async update(id, attributes) {
    try {
      return await this.repository.update(id, attributes);
    } catch (error) {
      throw error;
    }
  }

  async updateOrCreate(query, attributes) {
    try {
      return await this.repository.updateOrCreate(query, attributes);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
