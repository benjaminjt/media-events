/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint func-names: 0 */
import sinon from 'sinon';
import { assert } from 'chai';
import MediaEventsProduction from '../dist/media-events.min.js';
import MediaEventsDevelopment from '../src/media-events.js';

// Get appropriate package to test
const production = process.env.NODE_ENV === 'production';
const MediaEvents = production ? MediaEventsProduction : MediaEventsDevelopment;

// Set up the mock, and stub MediaEvents.getWindow() to return it instead of the browser window API
const matchMediaMock = require('match-media-mock').create();
const windowMock = { matchMedia: matchMediaMock };
sinon.stub(MediaEvents.prototype, 'getWindow').returns(windowMock);
// sinon.stub(MediaEvents, 'update') //, () => ({ matchMedia: matchMediaMock }));

// Test media states
const testOne = {
  state: { type: 'screen', orientation: 'landscape', width: 1920, height: 1080 },
  result: { landscape: true, small: false, large: true },
};
const testTwo = {
  state: { type: 'screen', orientation: 'portrait', width: 1080, height: 1920 },
  result: { landscape: false, small: false, large: false },
};

// Test media query
const query = {
  landscape: '(orientation: landscape)',
  small: '(max-width: 600px)',
  large: '(min-width: 1200px)',
};

// Spec
describe('MediaEvents', function () {
  beforeEach(function () {
    matchMediaMock.setConfig(testOne.state);
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

  it('calls window.matchMedia with query string for each query', function () {
    const matchMediaSpy = sinon.spy(windowMock, 'matchMedia');
    const media = new MediaEvents(query);

    // Check call count
    assert.equal(matchMediaSpy.callCount, Object.keys(query).length);

    // Check call params
    Object.keys(query).forEach((key, i) => {
      assert.equal(matchMediaSpy.getCall(i).args[0], query[key]);
    });
  });

  it('returns an appropriate initial state', function () {
    let media = new MediaEvents(query);
    assert.deepEqual(media.state, testOne.result);

    // State two
    matchMediaMock.setConfig(testTwo.state);
    media = new MediaEvents(query);
    assert.deepEqual(media.state, testTwo.result);
  });

  // This might be difficult
  it('calls the addListener method on each MediaQueryList object');

  it('emits an \'update\' event each time any MediaQueryListListener is called with an update', function () {
    const media = new MediaEvents(query);
    const updateStub = sinon.stub();
    media.on('update', updateStub);

    // Reach into the array of MediaQueryList objects and call the listener
    media.mqList[0].listener({ matches: false });
    assert.isTrue(updateStub.calledOnce);
  });

  it('emits a \'<key>\' event when the associated MediaQueryList object updates to \'true\'', function () {
    const media = new MediaEvents(query);
    const updateStub = sinon.stub();
    media.on('small', updateStub);

    // Reach into the array of MediaQueryList objects and call the listener
    media.mqList[1].listener({ matches: true });
    assert.isTrue(updateStub.calledOnce);
  });

  it('emits a \'not-<key>\' event when the associated MediaQueryList object updates to \'false\'', function () {
    const media = new MediaEvents(query);
    const stub = sinon.stub();
    media.on('not-landscape', stub);

    // Reach into the array of MediaQueryList objects and call the listener
    media.mqList[0].listener({ matches: false });
    assert.isTrue(stub.calledOnce);
  });

  describe('#destroy', function () {
    it('calls removeAllListeners on itself', function () {
      const media = new MediaEvents(query);
      const stub = sinon.stub(media, 'removeAllListeners');
      media.destroy();
      assert.isTrue(stub.calledOnce);
    });

    it('calls the removeListener method on each MediaQueryList object', function () {
      const media = new MediaEvents(query);
      const stubs = media.mqList.map((mqObj) => sinon.stub(mqObj.mq, 'removeListener'));
      media.destroy();
      stubs.forEach((stub) => assert.isTrue(stub.calledOnce));
    });
  });
});
