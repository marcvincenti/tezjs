import chai from 'chai';

const assert = chai.assert;

import lib from '../src/index.js';

describe('Using rpc library', () => {

  it('should return the head of main chain', (done) => {
    lib.rpc.getHead((err, res) => {
      assert.isNull(err, 'balance request have failed');
      // TODO: add integration tests
      done();
    });
  });

});
