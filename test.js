'use strict';

const { expect } = require('chai');
const { createBuilder, createTempDir } = require("broccoli-test-helper");
const sucrase = require('./index')

describe('broccoli-sucrase', function() {
  let input;
  let output;

  beforeEach(async function() {
    input = await createTempDir();
  });

  afterEach(async function() {
    await input.dispose();
    if (output) {
      await output.dispose();
    }
  })

  function evalAndGetAmdDefaultExport(code, expectedModuleId) {
    let module = new Function('define', code);
    let moduleId;
    let dependencies;
    let cb;
    function define(_moduleId, _dependencies, _cb) {
      moduleId = _moduleId;
      dependencies = _dependencies;
      cb = _cb;
    }

    module(define);

    expect(moduleId).to.eql(expectedModuleId);
    expect(dependencies).to.eql(['exports', 'require']);
    const exports = {};
    cb(exports);
    return exports;
  }

  function evalAndGetCJSDefaultExport(code) {
    let module = new Function('exports', code);
    const exports = {};
    module(exports);
    return exports;
  }

  it('wraps in named AMD', function() {
    const wrapInNamedAmd = sucrase.wrapInNamedAmd;
    const wrapped = wrapInNamedAmd(`exports.default = 1;`, 'i/am/module');
    const exports = evalAndGetAmdDefaultExport(wrapped, 'i/am/module');
    expect(exports).to.eql({ default: 1 });
  });

  it('is ok', async function() {
    const subject = sucrase(input.path(), {
      sucrase: {
      }
    });
    output = createBuilder(subject);

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

    const exports = evalAndGetCJSDefaultExport(A_JS);
    const foo = new exports.default();

    expect(foo.foo).to.eql(1);
    expect(await foo.apple()).to.eql(1);
  });

  it('supports named AMD', async function() {
    const subject = sucrase(input.path(), {
      namedAmd: true,
      sucrase: { }
    });

    output = createBuilder(subject);

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

    const exports = evalAndGetAmdDefaultExport(A_JS, 'a');
    const foo = new exports.default();

    expect(foo.foo).to.eql(1);
    expect(await foo.apple()).to.eql(1);
  })
});
