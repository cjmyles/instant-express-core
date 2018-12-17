import assert from 'assert';
import InstantAPI from '../src/index';
import { Actions, Controller, FirestoreRepository } from '../src/index';

const instant = InstantAPI();

describe('InstantAPI', () => {
  it('Actions class should exist', () => {
    assert.equal(typeof Actions, 'function');
  });

  it('Controller class should exist', () => {
    assert.equal(typeof Controller, 'function');
  });

  it('FirestoreRepository class should exist', () => {
    assert.equal(typeof FirestoreRepository, 'function');
  });
});
