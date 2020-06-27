import assert from 'assert';
import mergeOptions from '@/index.js';

describe('test external function validates its own configuration', () => {
  describe('test first level config types', () => {
    it(`throws an error when optionConfig isn't an object`, () => {
      function errorCase() {
        mergeOptions({ optionConfig: null, userOptions: {} });
      }
      assert.throws(errorCase, /Expected optionConfig to be an object with declarative option configuration, got/);
    });

    it(`throws an error when userOptions isn't an object`, () => {
      function errorCase() {
        mergeOptions({
          optionConfig: {
            active: {
              default: false,
              description: 'boolean',
              validator: (x) => typeof x === 'boolean',
            },
          },
          userOptions: 123,
        });
      }
      assert.throws(errorCase, /Expected userOptions to be an object, got/);
    });

    it(`throws an error when preffix isn't a string`, () => {
      function errorCase() {
        mergeOptions({
          optionConfig: {
            active: {
              default: false,
              description: 'boolean',
              validator: (x) => typeof x === 'boolean',
            },
          },
          userOptions: {},
          preffix: !true,
        });
      }
      assert.throws(errorCase, /Expected preffix to be a string, got/);
    });

    it(`throws an error when suffix isn't a string`, () => {
      function errorCase() {
        mergeOptions({
          optionConfig: {
            active: {
              default: false,
              description: 'boolean',
              validator: (x) => typeof x === 'boolean',
            },
          },
          userOptions: {},
          suffix: 123,
        });
      }
      assert.throws(errorCase, /Expected suffix to be a string, got/);
    });

    it(`throws an error when strict isn't a boolean`, () => {
      function errorCase() {
        mergeOptions({
          optionConfig: {
            active: {
              default: false,
              description: 'boolean',
              validator: (x) => typeof x === 'boolean',
            },
          },
          userOptions: {},
          strict: 'a cabbage',
        });
      }
      assert.throws(errorCase, /Expected strict to be a boolean, got/);
    });
  });

  describe('test each option config', () => {
    it(`throws an error when one of option in config isn't an object`, () => {
      function errorCase() {
        mergeOptions({
          optionConfig: {
            active: 35,
          },
          options: {},
        });
      }
      assert.throws(
        errorCase,
        /Expected optionConfig\.active to be an object with declarative option configuration, got/,
      );
    });

    describe('required and default', () => {
      it(`throws an error when one of option in config haven't required property`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                description: 'boolean',
                validator: (x) => typeof x === 'boolean',
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Expected optionConfig.active to either have required or default value/);
      });

      it(`don't throw an error when one of option in config haven't required property but have default value`, () => {
        const merged = mergeOptions({
          optionConfig: {
            active: {
              default: false,
              description: 'boolean',
              validator: (x) => typeof x === 'boolean',
            },
          },
          options: {},
        });
        assert.strictEqual(merged.active, false);
      });

      it(`throws an error when one of option in config required property isn't either boolean or function`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                required: 1,
                description: 'boolean',
                validator: (x) => typeof x === 'boolean',
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Expected optionConfig.active.required to be either boolean or function, got/);
      });
    });

    describe('description', () => {
      it(`throws an error when one of option in config haven't description property`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                required: true,
                validator: (x) => typeof x === 'boolean',
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Missing description on optionConfig.active/);
      });

      it(`throws an error when one of option in config description property isn't a string`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                required: true,
                description: Infinity,
                validator: (x) => typeof x === 'boolean',
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Expected optionConfig\.active\.description to be a string, got/);
      });
    });

    describe('validator', () => {
      it(`throws an error when one of option in config haven't validator property`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                required: true,
                description: 'boolean',
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Missing validator on optionConfig.active/);
      });

      it(`throws an error when one of option in config validator property isn't a string`, () => {
        function errorCase() {
          mergeOptions({
            optionConfig: {
              active: {
                required: true,
                description: 'a boolean',
                validator: true,
              },
            },
            options: {},
          });
        }
        assert.throws(errorCase, /Expected optionConfig\.active\.validator to be a function, got/);
      });
    });
  });
});
