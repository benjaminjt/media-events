/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
import sinon from 'sinon';
import { assert } from 'chai';

import MediaEvents from '../src/media-events.js';

describe('MediaEvents', function () {
  it('is a class', function () {
    const mq = new MediaEvents({});
    assert.instanceOf(mq, MediaEvents);
  });

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

  it('exposes equivalent #on and #addListener methods', function () {
    const mq = new MediaEvents({});
    assert.isFunction(mq.on);
    assert.isFunction(mq.addListener);
    assert.equal(mq.on, mq.addListener);
  });

  it('exposes a #removeListener method', function () {
    const mq = new MediaEvents({});
    assert.isFunction(mq.removeListener);
  });

  it('exposes a #destroy method', function () {
    const mq = new MediaEvents({});
    assert.isFunction(mq.destroy);
  });
});
