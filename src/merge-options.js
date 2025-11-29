import hasProperty from '@/utils/hasProperty.js';

/**
 * @typedef {Object} Option
 * @property {boolean|function} [required] - a flag or function accepts userOptions
 * @property {*} [default] - default value for fallback if user option fail validation
 * @property {function} validator - function for validating user option. Accepts userValue as first argument and userOptions as second. Should return boolean value
 * @property {string} description - human readable validator description. Uses to compose an error message and warning
 */

/**
 * Uses option configuration to iterate over passed user options.
 * Returns an object with user options passed validation and/or default not required values.
 * Throws an error for every missing required option.
 * Fallback to default value to every not required option.
 * If user value fails validation throws an error in strict mode or otherwise shows a warning message and fallback to default value.
 * All errors and warnings are verbose and composed based on description of options.
 * @param {Object} config - required configuration
 * @param {Object.<string, Option>} config.optionConfig - declarative option configuration
 * @param {Object} [config.userOptions={}] - user options needs validation before merge
 * @param {string} [config.preffix=''] - string before an error or warning message
 * @param {string} [config.suffix=''] - string after an error or warning message
 * @param {boolean} [config.strict=true] - strict mode flag. Default = true.
 * In strict mode the function throws an error, when user option fails validaton.
 * Otherwise the function shows warning message and fallback to default value.
 * @return {Object} an object with all keys described in options with userOption values if they pass validation and/or default not required values.
 */

function _mergeOptions({ optionConfig, userOptions = {}, preffix = '', suffix = '', strict = true }) {
  const createMessage = (message) => [preffix, message, suffix].join(' ');

  const mergedOptions = {};

  // iterate over optionConfig to merge only options described in config
  for (const optionKey in optionConfig) {
    if (hasProperty(optionConfig, optionKey)) {
      const optionPropertyConfig = optionConfig[optionKey];
      const { required, default: _default, description, validator } = optionPropertyConfig;
      const userValue = userOptions[optionKey];

      // required can be function
      const isRequired = hasProperty(optionPropertyConfig, 'required')
        ? typeof required === 'function'
          ? required(userOptions)
          : required
        : false;

      const isUserOptionPassed = hasProperty(userOptions, optionKey);

      const isValid = validator(userValue, userOptions);

      if (isRequired) {
        if (isUserOptionPassed) {
          if (isValid) {
            mergedOptions[optionKey] = userValue;
          } else {
            throw new TypeError(
              createMessage(`Expected ${optionKey} to be ${description}, got ${typeof userValue} ${userValue}.`),
            );
          }
        } else {
          throw new TypeError(createMessage(`${optionKey} is required.`));
        }
      } else {
        mergedOptions[optionKey] = _default;
        if (isUserOptionPassed) {
          if (isValid) {
            mergedOptions[optionKey] = userValue;
          } else {
            if (strict) {
              throw new TypeError(
                createMessage(`Expected ${optionKey} to be ${description}, got ${typeof userValue} ${userValue}.`),
              );
            } else {
              console.warn(
                createMessage(
                  `Expected ${optionKey} to be ${description}, got ${typeof userValue} ${userValue}. Fallback to default value ${_default}.`,
                ),
              );
            }
          }
        }
      }
    }
  }

  return mergedOptions;
}

export default _mergeOptions;
