/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
import sinon from 'sinon';
import { assert } from 'chai';

import MediaEvents from '../src/media-events.js';

describe('MediaEvents', function () {
  it('accepts a query as an object only', function () {
    assert.doesNotThrow(() => new MediaEvents({}));
    assert.throws(
      () => new MediaEvents(),
      TypeError,
      null,
      'expected an error when parsed null'
    );
    assert.throws(
      () => new MediaEvents('string'),
      TypeError,
      null,
      'expected an error when parsed a string'
    );
    assert.throws(
      () => new MediaEvents([]),
      TypeError,
      null,
      'expected an error when parsed an array'
    );
    assert.throws(
      () => new MediaEvents(0),
      TypeError,
      null,
      'expected an error when parsed a number'
    );
  });

  it('calls window.matchMedia with query string');
  it('calls the addListener method on each MediaQueryList object');
  it('emits an \'update\' event each time any MediaQueryListListener is called');
  it('emits a \'<key>\' event when the associated MediaQueryList object updates to \'true\'');
  it('emits a \'not-<key>\' event when the associated MediaQueryList object updates to \'false\'');

  describe('#destroy', function () {
    it('calls removeAllListeners on itself');
    it('calls the removeListener method on each MediaQueryList object');
  });
});
