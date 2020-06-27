import assert from 'assert';
import mergeOptions from '@/merge-options.js';

describe('mergeOptions', () => {
  describe('works with required configuration', () => {
    const REQUIRED_ZERO_TO_ONE_NUMBER_CONFIG = {
      required: true,
      description: 'a number between 0 and 1',
      validator: (x) => typeof x === 'number' && 0 <= x && x <= 1,
    };

    it('merge valid user value', () => {
      const optionConfig = {
        threshold: REQUIRED_ZERO_TO_ONE_NUMBER_CONFIG,
      };
      const userValue = 0.5;
      const userOptions = {
        threshold: userValue,
      };
      const mergedOptions = mergeOptions({ optionConfig, userOptions });
      assert.strictEqual(mergedOptions.threshold, userValue);
    });

    it('throws an error with description if user value fails validation', () => {
      const optionConfig = {
        threshold: REQUIRED_ZERO_TO_ONE_NUMBER_CONFIG,
      };
      const userValue = 3;
      const userOptions = {
        threshold: userValue,
      };
      function errorCase() {
        mergeOptions({ optionConfig, userOptions });
      }
      assert.throws(errorCase, /Expected threshold to be a number between 0 and 1, got/);
    });

    it('throws an error with description if option was not passed', () => {
      const optionConfig = {
        threshold: REQUIRED_ZERO_TO_ONE_NUMBER_CONFIG,
      };
      const userOptions = {
        somethingElse: 42,
      };
      function errorCase() {
        mergeOptions({ optionConfig, userOptions });
      }
      assert.throws(errorCase, /threshold is required\./);
    });
  });

  describe('works with optional configuration', () => {
    const DEFAULT_VALUE = 0;
    const OPTIONAL_NUMBER_CONFIG = {
      default: DEFAULT_VALUE,
      description: 'a number',
      validator: (x) => typeof x === 'number',
    };

    it('merge valid user value', () => {
      const optionConfig = {
        threshold: OPTIONAL_NUMBER_CONFIG,
      };
      const userValue = 42;
      const userOptions = {
        threshold: userValue,
      };
      const mergedOptions = mergeOptions({ optionConfig, userOptions });
      assert.strictEqual(mergedOptions.threshold, userValue);
    });

    it('throws an error with description if user value fails validation in default strict mode', () => {
      const optionConfig = {
        threshold: OPTIONAL_NUMBER_CONFIG,
      };
      const userOptions = {
        threshold: '42',
      };
      function errorCase() {
        mergeOptions({ optionConfig, userOptions });
      }
      assert.throws(errorCase, /Expected threshold to be a number, got string/);
    });

    it('fallback to default value and shows warning if user value fails validation in not strict mode', () => {
      const optionConfig = {
        threshold: OPTIONAL_NUMBER_CONFIG,
      };
      const userOptions = {
        threshold: '42',
      };
      const mergedOptions = mergeOptions({ optionConfig, userOptions, preffix: '[Test warning]:', strict: false });
      assert.strictEqual(mergedOptions.threshold, DEFAULT_VALUE);
    });
  });

  describe('works with conditional configuration', () => {
    const DEFAULT_VALUE = 0.5;
    const DEPENDING_KEY = 'haveThreshold';
    const DEPENDING_VALUE = true;
    const CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG = {
      required: (userOptions) =>
        Object.prototype.hasOwnProperty.call(userOptions, DEPENDING_KEY) &&
        userOptions[DEPENDING_KEY] === DEPENDING_VALUE,
      default: DEFAULT_VALUE,
      description: 'a number between 0 and 1',
      validator: (x) => typeof x === 'number' && 0 <= x && x <= 1,
    };

    describe('works as optional if condition evaluates false', () => {
      it('and merge valid user value', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userValue = 0.75;
        const userOptions = {
          threshold: userValue,
        };
        const mergedOptions = mergeOptions({ optionConfig, userOptions });
        assert.strictEqual(mergedOptions.threshold, userValue);
      });

      it('and fallback to default value if nothing passed', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const mergedOptions = mergeOptions({ optionConfig, userOptions: {} });
        assert.strictEqual(mergedOptions.threshold, DEFAULT_VALUE);
      });

      it('and throws an error with description if user value fails validation in default strict mode', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userOptions = {
          threshold: '0.5',
        };
        function errorCase() {
          mergeOptions({ optionConfig, userOptions });
        }
        assert.throws(errorCase, /Expected threshold to be a number between 0 and 1, got string/);
      });

      it('and fallback to default value and shows warning if user value fails validation in not strict mode', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userOptions = {
          threshold: '42',
        };
        const mergedOptions = mergeOptions({ optionConfig, userOptions, preffix: '[Test warning]:', strict: false });
        assert.strictEqual(mergedOptions.threshold, DEFAULT_VALUE);
      });
    });

    describe('works as required if condition evaluates true', () => {
      it('and merge valid user value', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userValue = 0.75;
        const userOptions = {
          threshold: userValue,
          [DEPENDING_KEY]: DEPENDING_VALUE,
        };
        const mergedOptions = mergeOptions({ optionConfig, userOptions });
        assert.strictEqual(mergedOptions.threshold, userValue);
      });

      it('throws an error with description if user value fails validation', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userValue = 1.5;
        const userOptions = {
          threshold: userValue,
          [DEPENDING_KEY]: DEPENDING_VALUE,
        };
        function errorCase() {
          mergeOptions({ optionConfig, userOptions });
        }
        assert.throws(errorCase, /Expected threshold to be a number between 0 and 1, got/);
      });

      it('throws an error with description if option was not passed', () => {
        const optionConfig = {
          threshold: CONDITIONAL_ZERO_TO_ONE_NUMBER_CONFIG,
        };
        const userOptions = {
          [DEPENDING_KEY]: DEPENDING_VALUE,
        };
        function errorCase() {
          mergeOptions({ optionConfig, userOptions });
        }
        assert.throws(errorCase, /threshold is required\./);
      });
    });
  });

  describe('properly adds preffix and suffix', () => {
    it('preffix exist on error message', () => {
      const optionConfig = {
        isExist: {
          required: true,
          description: 'a boolean',
          validator: (x) => typeof x === 'boolean',
        },
      };
      const userOptions = {
        isExist: null,
      };
      function errorCase() {
        mergeOptions({ optionConfig, userOptions, preffix: 'Some string' });
      }
      assert.throws(errorCase, /Some string/);
    });

    it('suffix exist on error message', () => {
      const optionConfig = {
        isExist: {
          required: true,
          description: 'a boolean',
          validator: (x) => typeof x === 'boolean',
        },
      };
      const userOptions = {
        isExist: null,
      };
      function errorCase() {
        mergeOptions({ optionConfig, userOptions, suffix: 'string at the end of error message' });
      }
      assert.throws(errorCase, /.*string at the end of error message$/);
    });
  });
});
