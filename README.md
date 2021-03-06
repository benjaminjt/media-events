[logo-image]: https://raw.githubusercontent.com/benjaminjt/media-events/master/logo/media-events-logo.png
[travis-image]: https://img.shields.io/travis/benjaminjt/media-events.svg?style=flat-square
[travis-url]: https://travis-ci.org/benjaminjt/media-events
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE

[matchMedia-url]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[MediaList-url]: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListListener
[compatability-table]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia#Browser_compatibility

<img
  alt="Media Events Logo"
  src="https://raw.githubusercontent.com/benjaminjt/media-events/master/logo/media-events-logo.png"
  width="400px"
/>

[![Travis][travis-image]][travis-url]
[![License][license-image]][license-url]

Media events is a tiny library that makes javascript media queries easy; allowing you to write
@media rules just as you would with CSS.

### Installation

```bash
npm install media-events --save
```

or

```bash
bower media-events
```

### Quick Start

```js
// Construct a media object like this
const media = new MediaEvent({
  landscape: '(orientation: landscape)',
  small: '(max-width: 600px)',
});

// Now the state can be inspected
if (media.state.small) handleSmall();
else if (!media.state.landscape) handlePortrait();
else handleEveryElse();

// Updates events are emitted every time something changes
media.on('update', (state) => handleUpdate(state));

// The media object just extends EventEmitter, so all the normal methods work
media.once('update', (state) => handleOneUpdate(state));
media.removeListener('update', handleUpdate);

// This is great for React.js components
media.on('update', (state) => this.setState({ mediaState: state }));

// Or for Flux/Redux/{Whatever}ux
media.on('update', (state) => store.dispatch({ type: 'MEDIA_UPDATE', mediaState: state }));

// Events are also emitted for when individual sub-queries match
media.on('small', () => smallNow());
media.on('landscape', () => landscapeNow());

// And just for symmetry
media.on('not-small', () => notSmallNow());

// Clean up
media.destroy();
```

### Full Examples

_coming soon..._

### Dependencies

Just `EventEmitter` from Node.js and the [Window.matchMedia][matchMedia-url] and
[MediaQueryListListener][MediaList-url] APIs.

### Compatability

See the MDN compatibility table for Window.matchMedia:
[https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia#Browser_compatibility][compatability-table]
