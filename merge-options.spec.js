import assert from 'assert';
import mergeOptions from './merge-options.js';

describe('mergeOptions', function() {
  describe('throws errors when invalid arguments passed', function() {
    it("throws an error when options isn't an object", function() {
      assert.throws(function() {
        const defaults = {};
        const target = {};
        mergeOptions({ options: null, defaults, target });
      });
    });

    it("throws an error when defaults isn't an object", function() {
      assert.throws(function() {
        const defaults = {};
        const target = {};
        mergeOptions({ options, defaults: null, target });
      });
    });

    it("throws an error when one of default options isn't an object", function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: 32,
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it('throws an error when one of default options lacks of initial value', function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            description: 'boolean',
            validator: x => typeof x === 'boolean',
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it('throws an error when one of default options lacks of description', function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            initial: false,
            validator: x => typeof x === 'boolean',
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it("throws an error when one of default options description isn't string", function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            initial: false,
            description: null,
            validator: x => typeof x === 'boolean',
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it('throws an error when one of default options lacks of validator', function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            initial: false,
            description: 'boolean',
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it("throws an error when one of default options validator isn't function", function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            initial: false,
            description: 'boolean',
            validator: 34,
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it("throws an error when one of default options validator returns not boolean", function() {
      assert.throws(function() {
        const options = {};
        const defaults = {
          options: {
            initial: false,
            description: 'x as string',
            validator: x => String(x),
          },
        };
        const target = {};
        mergeOptions({ options, defaults, target });
      });
    });

    it("throws an error when target isn't an object", function() {
      assert.throws(function() {
        const options = {};
        const defaults = {};
        mergeOptions({ options, defaults, target: null });
      });
    });

    it('throws an error when not string passed as warnPreffix', function() {
      assert.throws(function() {
        const options = {};
        const defaults = {};
        const target = {};
        const warnPreffix = null;
        mergeOptions({ options, defaults, target, warnPreffix });
      });
    });

    it('throws an error when not string passed as warnSuffix', function() {
      assert.throws(function() {
        const options = {};
        const defaults = {};
        const target = {};
        const warnSuffix = 0;
        mergeOptions({ options, defaults, target, warnSuffix });
      });
    });
  });

  describe('merges options correctly', function() {
    it('add passed option if its value passes validation', function() {
      const defaults = {
        option: {
          initial: 0,
          description: 'a number between 0 and 1',
          validator: x => typeof x === 'number' && 0 <= x && x <= 1,
        },
      };
      const target = {};
      const optionValue = 0.5;
      mergeOptions({ options: { option: optionValue }, defaults, target });
      assert.strictEqual(target.option, optionValue);
    });

    it('fallback to default value if passed value fails validation', function() {
      const defaults = {
        option: {
          initial: 0,
          description: 'a number between 0 and 1',
          validator: x => typeof x === 'number' && 0 <= x && x <= 1,
        },
      };
      const target = {};
      const optionValue = 3;
      mergeOptions({ options: { option: optionValue }, defaults, target });
      assert.strictEqual(target.option, defaults.option.initial);
    });

    it('options not described in defaults will not be merged into target', function() {
      const defaults = {};
      const target = {};
      const options = {
        undescribedOption: 42,
      };
      mergeOptions({ options, defaults, target });
      assert.strictEqual(Object.prototype.hasOwnProperty.call(target, 'undescribedOption'), false);
    });

    it('replaces existing option if its value passes validation', function() {
      const defaults = {
        option: {
          initial: 0,
          description: 'a number between 0 and 1',
          validator: x => typeof x === 'number' && 0 <= x && x <= 1,
        },
      };
      const target = {
        option: 0.5,
      };
      const newValue = 1;
      mergeOptions({ options: { option: newValue }, defaults, target });
      assert.strictEqual(target.option, newValue);
    });

    it("don't affect keys in target not described in defaults", function() {
      const defaults = {};
      const oldValue = 0.5;
      const target = {
        option: oldValue,
      };
      const newValue = 1;
      const options = {
        option: newValue,
      };
      mergeOptions({ options, defaults, target });
      assert.strictEqual(target.option, oldValue);
    });
  });
});
