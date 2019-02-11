'use strict';

const Plugin = require('broccoli-persistent-filter');
const sucrase = require('sucrase')

class Sucrase extends Plugin {
  constructor(inputTree, options = {}) {
    super(inputTree, {
      // TODO: enable parallelism
      async: false,

      // TODO: lets experiment with this some, maybe  sucrase is fast enough to not need this?
      persist: true
    });
    this.options = options;
    this.extensions = ['js'];
  }

  async processString(content, filePath) {
    return (await sucrase.transform(content, {
      ... {
        filePath,
        transforms: ['typescript', 'imports']
      },
      ...this.options.surcase
    })).code;
  }

  // this is implemented for persistent cache key creation by broccoli-persistent-filter
  baseDir() {
    return __dirname;
  }
}

module.exports = function surcase(input, options) {
  return new Sucrase(input, options);
};

module.exports.Plugin = Sucrase;
