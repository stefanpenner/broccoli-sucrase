# broccoli-sucrase
[![Build Status](https://travis-ci.org/stefanpenner/broccoli-swc.svg?branch=master)](https://travis-ci.org/stefanpenner/broccoli-swc)

Broccoli Plugin for Sucrase (a babel alternative):

> Sucrase is an alternative to Babel that allows super-fast development builds. Instead of compiling a large range of JS features to be able to work in Internet Explorer, Sucrase assumes that you're developing with a recent browser or recent Node.js version, so it focuses on compiling non-standard language extensions: JSX, TypeScript, and Flow. Because of this smaller scope, Sucrase can get away with an architecture that is much more performant but less extensible and maintainable. Sucrase's parser is forked from Babel's parser (so Sucrase is indebted to Babel and wouldn't be possible without it) and trims it down to a focused subset of what Babel solves. If it fits your use case, hopefully Sucrase can speed up your development experience!

* sucrase Repo: https://github.com/alangpierce/sucrase
* sucrase Site: https://sucrase.io/

This module aims to experiment using sucrase in the broccoli and ember-cli ecosystems.

## usage

### Basic via Brocfile.js or Broccoli pipeline

```js
// Brocfile.js
const sucrase = require('broccoli-sucrase');
module.exports = sucrase(__dirname + '/src', {
  namedAmd: true | false // optional, and defaults to false. If enabled, will produced named amd modules
  sucrase: { /* any option sucrase.transform supports */ }
}); // where src/**/*.js contains ecmascript
```

### Extension / Subclassing

```js
// Brocfile.js
const sucrase = require('broccoli-sucrase');

module.exports = class CustomSucrase extends sucrase.Plugin {
  // custom behavior
}
