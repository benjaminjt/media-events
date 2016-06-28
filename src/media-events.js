import { EventEmitter } from 'events';

export default class MediaEvents extends EventEmitter {
  constructor(query, ...args) {
    if (typeof query !== 'object' || query instanceof Array) {
      throw new TypeError('Must parse a query object to the MediaEvents constructor');
    }

    super(...args);
  }
  destroy() {

  }
}
