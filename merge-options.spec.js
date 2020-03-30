const assert = require('assert');
const mergeOptions = require('./dist/merge-options.min.js');

describe('mergeOptions', function() {
  describe('throws errors when invalid arguments passed', function() {
    it("throws an error when userOptions isn't an object", function() {
      function errorCase() {
        const userOptions = null;
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected userOptions is required not null, not array object, got .*$/);
    });

    it("throws an error when defaults isn't an object", function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = 42;
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected defaults is required not null, not array object, got .*$/);
    });

    it("throws an error when one of default options isn't an object", function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: false,
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected each default option is an object, got .*$/);
    });

    it('throws an error when one of default options lacks of initial value', function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            // initial: false,
            description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected .* have initial property/);
    });

    it('throws an error when one of default options lacks of description', function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            // description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected .* have description property/);
    });

    it("throws an error when one of default options description isn't string", function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: NaN,
            validator: x => typeof x === 'boolean',
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected .* description is a string, got .*$/);
    });

    it('throws an error when one of default options lacks of validator', function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: 'boolean',
            // validator: x => typeof x === 'boolean',
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected .* have validator property/);
    });

    it("throws an error when one of default options validator isn't function", function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: 'boolean',
            validator: undefined,
          },
        };
        const options = mergeOptions({ userOptions, defaults });
      }
      assert.throws(errorCase, /Expected .* validator is a function, got .*$/);
    });

    it('throws an error when not string passed as warnPreffix', function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const warnPreffix = new Error();
        const options = mergeOptions({ userOptions, defaults, warnPreffix });
      }
      assert.throws(errorCase, /Expected warnPreffix is optional string, got .*$/);
    });

    it('throws an error when not string passed as warnSuffix', function() {
      function errorCase() {
        const userOptions = {
          haveToAdjustScroll: true,
        };
        const defaults = {
          haveToAdjustScroll: {
            initial: false,
            description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const warnSuffix = Math.PI;
        const options = mergeOptions({ userOptions, defaults, warnSuffix });
      }
      assert.throws(errorCase, /Expected warnSuffix is optional string, got .*$/);
    });
  });

  describe('merges options correctly', function() {
    it('user option overrides default value if it passes validation', function() {
      const defaults = {
        threshold: {
          initial: 0,
          description: 'a number between 0 and 1',
          validator: x => typeof x === 'number' && 0 <= x && x <= 1,
        },
      };
      const userValue = 0.5;
      const userOptions = {
        threshold: userValue,
      };
      const options = mergeOptions({ userOptions, defaults });
      assert.strictEqual(options.threshold, userValue);
    });

    it('fallback to default value if passed value fails validation', function() {
      const defaults = {
        threshold: {
          initial: 0,
          description: 'a number between 0 and 1',
          validator: x => typeof x === 'number' && 0 <= x && x <= 1,
        },
      };
      const userValue = 3;
      const userOptions = {
        threshold: userValue,
      };
      const options = mergeOptions({ userOptions, defaults });
      assert.strictEqual(options.threshold, defaults.threshold.initial);
    });

    it('options not described in defaults will not be merged', function() {
      const defaults = {};
      const userOptions = {
        undescribedOption: 42,
      };
      const options = mergeOptions({ userOptions, defaults });
      assert.strictEqual(Object.prototype.hasOwnProperty.call(options, 'undescribedOption'), false);
    });
  });
});
