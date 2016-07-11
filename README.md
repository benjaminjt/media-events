[logo-image]: https://raw.githubusercontent.com/benjaminjt/media-events/master/logo/media-events-logo.png
[travis-image]: https://img.shields.io/travis/benjaminjt/media-events.svg?style=flat-square
[travis-url]: https://travis-ci.org/benjaminjt/media-events
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE

<img
  alt="Media Events Logo"
  src="https://raw.githubusercontent.com/benjaminjt/media-events/master/logo/media-events-logo.png"
  width="400px"
/>

[![Travis][travis-image]][travis-url]
[![License][license-image]][license-url]

Media events is a tiny library that makes javascript media queries easy; allowing you to write
@media rules just as you would with CSS.

__Simple as this:__
```js
const media = new MediaEvent({ small: 'max-width: 600px' });

if (media.state.small) doSmallThings();
else doBigThings();
```

__Something more complex:__

```js
const media = new MediaEvent({
  small: 'max-width: 600px',
  landscape: 'orientation: landscape',
  highRes: 'min-resolution: 300dpi',
});

if (!media.state.small && media.state.highRes) handleLargeHighResScreens();
```

__Events are generated every time something changes:__
```js
media.on('update', (state) => {
  if (state.small) handleSmallMedia();
  else notSmall();
});
```
__Events work great with React.js and Flux/Redux/{Whatever}ux:__

```js
// Within a React.js component:
media.on('update', (state) => this.setState({ mediaState: state }));

// Or anywhere with flux/redux:
media.on('update', (state) => store.dispatch({ type: 'MEDIA_UPDATE', mediaState: state }));
```

__Events are also issued when a particular query's state changes to true:__
```js
media.on('small', () => smallNow());
media.on('landscape', () => landscapeNow());
```

__And of course, when a query's state changes to false:__
```js
media.on('not-small', () => notSmallNow());
```