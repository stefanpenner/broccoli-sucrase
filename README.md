# broccoli-sucrase
[![Build Status](https://travis-ci.org/stefanpenner/broccoli-swc.svg?branch=master)](https://travis-ci.org/stefanpenner/broccoli-swc)

Broccoli Plugin for Sucrase (a babel alternative):

> Super-fast alternative to Babel for when you can target modern JS runtimes

* sucrase Repo: https://github.com/alangpierce/sucrase
* sucrase Site: https://sucrase.io/

This module aims to experiment using sucrase in the broccoli and ember-cli ecosystems.

## usage

### Basic via Brocfile.js or Broccoli pipeline

```js
// Brocfile.js
const sucrase = require('broccoli-sucrase');
module.exports = sucrase(__dirname + '/src', {
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
