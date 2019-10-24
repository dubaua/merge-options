function isObject(value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false;
}

/**
 * @typedef {Object} DefaultOption
 * @property {*} initial - Initial value for fallback if user option fail validation
 * @property {string} description - Validator description for human
 * @property {function} validator - Function for validating user option. Should return boolean value
 */

/**
 * @typedef {Object} requiredArguments
 * @property {Object} options - user options needs validation before merge
 * @property {Object.<string, DefaultOption>} defaults - default options object each key contains an object with initial value, validator and description
 * @property {Object} target - target object in which default and user options will be merged
 * @property {String} [warnPreffix] - string before warning message, useful to pass name of tool
 * @property {String} [warnSuffix] - string after warning message, useful to pass link to documentation
 */

/**
 * Merges given user options passed validation and defaults to target object
 * Shows warning if given option is invalid
 * @param {...requiredArguments} config - confuguration object
 */

function mergeOptions({ options = {}, defaults, target, warnPreffix = '', warnSuffix = '' }) {
  // validating user input
  if (!isObject(options)) {
    throw new TypeError(`options is required and should be an object, got ${typeof options} ${options}.`);
  }

  if (!isObject(defaults)) {
    throw new TypeError(`defaults is required and should be an object, got ${typeof defaults} ${defaults}.`);
  }

  Object.keys(defaults)
    .map(key => defaults[key])
    .forEach(option => {
      if (!isObject(option)) {
        throw new TypeError(`default option should be an object, got ${typeof option} ${option}.`);
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'initial')) {
        throw new TypeError(`default options should have initial value`);
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'description')) {
        throw new TypeError(`default options should have description`);
      }

      if (typeof option.description !== 'string') {
        throw new TypeError(
          `default option description should be a string, got ${typeof option.description} ${option.description}`
        );
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'validator')) {
        throw new TypeError(`default options should have validator function`);
      }

      if (typeof option.validator !== 'function') {
        throw new TypeError(
          `default option validator should be a function, got ${typeof option.validator} ${option.validator}`
        );
      } else {
        // testing validator for primitive data
        const dummies = [
          true,
          false,
          0,
          1,
          Math.PI,
          -Infinity,
          NaN,
          undefined,
          null,
          '',
          'a cabbage',
          'печенюха',
          [42, 1e3],
          { foo: 'bar' },
        ];
        for (let i = 0; i < dummies.length; i++) {
          const dummy = dummies[i];
          const validationResult = option.validator(dummy);
          if (typeof validationResult !== 'boolean') {
            throw new TypeError(
              `default option validator should return boolean, got ${typeof validationResult} when ${validationResult} passed`
            );
          }
        }
      }
    });

  if (!isObject(target)) {
    throw new TypeError(`target is required and should be an object, got ${typeof target} ${target}.`);
  }

  if (warnPreffix !== undefined && typeof warnPreffix !== 'string') {
    throw new TypeError(`warnPreffix should be a string, got ${typeof warnPreffix} ${warnPreffix}.`);
  }

  if (warnSuffix !== undefined && typeof warnSuffix !== 'string') {
    throw new TypeError(`warnSuffix should be a string, got ${typeof warnSuffix} ${warnSuffix}.`);
  }

  // iterate over defaults to merge only trusted options
  for (const key in defaults) {
    const { initial, description, validator } = defaults[key];
    // assing initial value first
    target[key] = initial;
    // if this option passed
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      const value = options[key];
      // if option valid, reassign it
      if (validator(value)) {
        target[key] = value;
      } else {
        // otherwise print what's wrong ang give clues
        console.warn(
          `${warnPreffix}Expected ${key} is ${description}, got %c${typeof value}`,
          'font-style: italic; text-transform: capitalize',
          `${value}. Fallback to default value ${initial}.`,
          warnSuffix
        );
      }
    }
  }
}

export default mergeOptions;
