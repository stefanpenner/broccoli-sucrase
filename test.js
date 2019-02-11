'use strict';

const { expect } = require('chai');
const { createBuilder, createTempDir } = require("broccoli-test-helper");
const surcase = require('./index')

describe('broccoli-sucrase', function() {
  let input;

  beforeEach(async function() {
    input = await createTempDir();
  });

  it('is ok', async function() {
    const subject = surcase(input.path(), {
      surcase: {
        jsc: {
        }
      }
    });
    const output = createBuilder(subject);

    input.write({
      'a.js': `
      export default class Foo {
        get foo() {
          return 1;
        }

        async apple() {
          return await Promise.resolve(1);
        }
      }
      `,

      'b': {
        'b.js': `
      export default class Foo {
        get foo() {
          return 1;
        }

        async apple() {
          await Promise.resolve(1);
        }
      }
      `
      },
      'foo.txt': 'do not compile'
    });

    await output.build();

    expect(output.changes()).to.deep.eql({
      'a.js': 'create',
      'b/': 'mkdir',
      'b/b.js': 'create',
      'foo.txt': 'create'
    });

    await output.build();

    expect(output.changes()).to.deep.eql({});

    expect(Object.keys(output.read())).to.deep.eql([ 'a.js', 'b', 'foo.txt' ])

    const A_JS = output.read()['a.js'];
    const a_module = new Function('exports', A_JS)
    const a_exports = Object.create(null);
    a_module(a_exports);
    const foo = new a_exports.default();

    expect(foo.foo).to.eql(1);
    expect(await foo.apple()).to.eql(1);
  })
});
