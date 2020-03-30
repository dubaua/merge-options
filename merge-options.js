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
 * @property {Object.<string, DefaultOption>} defaults - default options object each key contains an object with initial value, validator and description
 * @property {Object} [userOptions={}] - user options needs validation before merge
 * @property {String} [warnPreffix] - string before warning message, useful to pass name of tool
 * @property {String} [warnSuffix] - string after warning message, useful to pass link to documentation
 */

/**
 * Merges given user options passed validation and defaults to target object
 * Shows warning if given option is invalid
 * @param {...requiredArguments} config - confuguration object
 * @return {Object} an object with all keys described in defaults with userOption values if they pass validation
 */

function mergeOptions({ defaults, userOptions = {}, warnPreffix = '', warnSuffix = '' }) {
  if (!isObject(defaults)) {
    throw new TypeError(`Expected defaults is required not null, not array object, got ${typeof defaults} ${defaults}`);
  }

  Object.keys(defaults)
    .map(key => ({ key, option: defaults[key] }))
    .forEach(({ key, option }) => {
      if (!isObject(option)) {
        throw new TypeError(`Expected each default option is an object, got ${key} is ${typeof option} ${option}`);
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'initial')) {
        throw new TypeError(`Expected ${key} have initial property`);
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'description')) {
        throw new TypeError(`Expected ${key} have description property`);
      }

      const { description } = option;
      if (typeof description !== 'string') {
        throw new TypeError(`Expected ${key} description is a string, got ${typeof description} ${description}`);
      }

      if (!Object.prototype.hasOwnProperty.call(option, 'validator')) {
        throw new TypeError(`Expected ${key} have validator property`);
      }

      const { validator } = option;
      if (typeof validator !== 'function') {
        throw new TypeError(`Expected ${key} validator is a function, got ${typeof validator} ${validator}`);
      }
    });

  if (!isObject(userOptions)) {
    throw new TypeError(
      `Expected userOptions is required not null, not array object, got ${typeof userOptions} ${userOptions}`,
    );
  }

  if (warnPreffix !== undefined && typeof warnPreffix !== 'string') {
    throw new TypeError(`Expected warnPreffix is optional string, got ${typeof warnPreffix} ${warnPreffix}`);
  }

  if (warnSuffix !== undefined && typeof warnSuffix !== 'string') {
    throw new TypeError(`Expected warnSuffix is optional string, got ${typeof warnSuffix} ${warnSuffix}`);
  }

  const willReturn = {};
  // iterate over defaults to merge only trusted options
  for (const optionName in defaults) {
    const { initial, description, validator } = defaults[optionName];
    // assing initial value first
    willReturn[optionName] = initial;
    // if this option passed
    if (Object.prototype.hasOwnProperty.call(userOptions, optionName)) {
      const userValue = userOptions[optionName];
      // if option valid, reassign it
      if (validator(userValue)) {
        willReturn[optionName] = userValue;
      } else {
        // otherwise print what's wrong ang give clues
        console.warn(
          warnPreffix,
          `Expected ${optionName} is ${description}, got ${typeof userValue} ${userValue}.`,
          `Fallback to default value ${initial}.`,
          warnSuffix,
        );
      }
    }
  }

  return willReturn;
}

export default mergeOptions;
