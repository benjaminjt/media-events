import { EventEmitter } from 'events';

// Constants
const ready = 'ready';
const update = 'update';
const not = (key) => `not-${key}`;
const reserved = ['ready', 'update', 'error'];

// Errors
const queryObjectError = 'Must parse a query param (Object) to the MediaEvents constructor';
const reservedError = (word) => `Can not use reserved word '${word}'' as a key on the query object`;
const parenthesisError = 'All sub-queries must start with "(" and end with ")"';


export default class MediaEvents extends EventEmitter {
  /**
   * MediaEvents
   *
   * @param {Object} query
   * @returns {MediaEvents} media
  */
  constructor(query) {
    if (typeof query !== 'object' || query instanceof Array) throw new TypeError(queryObjectError);

    super();
    this.window = this.getWindow();
    this.update = this.update.bind(this);
    this.state = {};

    // Build an array of MediaQueryList objects and their listeners
    this.mqList = Object.keys(query)
      // Omit anything not a string; no errors here as query objects might be built dynamically
      .filter((key) => typeof query[key] === 'string')
      .map((media) => {
        // Check for reserved words; perhaps this should fail silently also?
        if (reserved.indexOf(media) !== -1) throw new Error(reservedError(media));

        // Check for parenthesis
        const subQuery = query[media];
        if (subQuery.indexOf('(') !== 0) throw new Error(parenthesisError);
        if (subQuery.lastIndexOf(')') !== subQuery.length - 1) throw new Error(parenthesisError);

        // Define a listener closure to use for the MediaQueryListLister
        const listener = (mq) => this.update(media, mq);

        // Hit the window.matchMedia API and attach our listener (adding parenthesis)
        const mq = this.window.matchMedia(subQuery);
        mq.addListener(listener);

        // Update the initial state
        this.state[media] = mq.matches;

        // And return an object which can be used for clean-up
        return { mq, listener };
      });

    this.emit(ready, this.state);
  }
  /**
   * #getWindow
   *
   * Wrapper methor to return window.matchMedia so a mock can be used
   *
   * @returns {Object} window
  */
  getWindow() {
    return window;
  }
  /**
   * #update
   *
   * @param {String} media; name/key for the sub-query update
   * @param {Object} MediaQueryList
  */
  update(media, mq) {
    const prev = this.state[media];
    const next = mq.matches;

    if (prev !== next) {
      // Fix the state; not sure if the copy operation is really necessary?
      this.state = Object.assign({}, this.state, { [media]: next });

      // Emit general update
      this.emit(update, this.state);

      // Emit key-specific updates
      this.emit(next === true ? media : not(media));
    }
  }
  /**
   * #destroy
  */
  destroy() {
    // Remove all listeners on this object
    this.removeAllListeners();

    // Call the MediaQueryList removeListener method for each mq
    this.mqList.forEach((query) => {
      query.mq.removeListener(query.listener);
    });
  }
}
