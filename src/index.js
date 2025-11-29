import hasProperty from '@/utils/hasProperty.js';
import isObject from '@/utils/isObject.js';
import _mergeOptions from '@/merge-options.js';

const MESSAGE_PREFIX = '[mergeOptions]:';
const MESSAGE_SUFFIX = '\nCheck out documentation https://github.com/dubaua/merge-options#parameters-and-return';

function throwTypeError(message) {
  throw new TypeError([MESSAGE_PREFIX, message, MESSAGE_SUFFIX].join(' '));
}

function optionConfigValidator(optionConfig) {
  for (const key in optionConfig) {
    if (hasProperty(optionConfig, key)) {
      const optionPropertyConfig = optionConfig[key];

      if (!isObject(optionPropertyConfig)) {
        throwTypeError(
          `Expected optionConfig.${key} to be an object with declarative option configuration, got ${typeof optionPropertyConfig} ${optionPropertyConfig}.`,
        );
      }

      if (hasProperty(optionPropertyConfig, 'required')) {
        const required = optionPropertyConfig.required;
        const requiredType = typeof required;
        if (!(requiredType === 'boolean' || requiredType === 'function')) {
          throwTypeError(
            `Expected optionConfig.${key}.required to be either boolean or function, got ${typeof required} ${required}.`,
          );
        }
      } else {
        if (!hasProperty(optionPropertyConfig, 'default')) {
          throwTypeError(`Expected optionConfig.${key} to either have required or default value.`);
        }
      }

      if (!hasProperty(optionPropertyConfig, 'default') && !hasProperty(optionPropertyConfig, 'required')) {
        throwTypeError(`Expected optionConfig.${key} to either have required or default value.`);
      }

      if (hasProperty(optionPropertyConfig, 'description')) {
        const description = optionPropertyConfig.description;
        if (typeof optionPropertyConfig.description !== 'string') {
          throwTypeError(
            `Expected optionConfig.${key}.description to be a string, got ${typeof description} ${description}.`,
          );
        }
      } else {
        throwTypeError(`Missing description on optionConfig.${key} config.`);
      }

      if (hasProperty(optionPropertyConfig, 'validator')) {
        const validator = optionPropertyConfig.validator;
        if (typeof optionPropertyConfig.validator !== 'function') {
          throwTypeError(
            `Expected optionConfig.${key}.validator to be a function, got ${typeof validator} ${validator}.`,
          );
        }
      } else {
        throwTypeError(`Missing validator on optionConfig.${key} config.`);
      }
    }
  }
  return isObject(optionConfig);
}

const OPTION_CONFIG = {
  optionConfig: {
    required: true,
    validator: optionConfigValidator,
    description: 'an object with declarative option configuration',
  },
  userOptions: {
    required: false,
    default: {},
    validator: isObject,
    description: 'an object',
  },
  prefix: {
    required: false,
    default: '',
    validator: (x) => typeof x === 'string',
    description: 'a string',
  },
  suffix: {
    required: false,
    default: '',
    validator: (x) => typeof x === 'string',
    description: 'a string',
  },
  strict: {
    required: false,
    default: true,
    validator: (x) => typeof x === 'boolean',
    description: 'a boolean',
  },
};

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
 * @param {string} [config.prefix=''] - string before an error or warning message
 * @param {string} [config.suffix=''] - string after an error or warning message
 * @param {boolean} [config.strict=true] - strict mode flag. Default = true
 * In strict mode the function throws an error, when user option fails validaton.
 * Otherwise the function shows warning message and fallback to default value.
 * @return {Object} an object with all keys described in options with userOption values if they pass validation and/or default not required values.
 */

function mergeOptions(config) {
  const validConfig = _mergeOptions({
    optionConfig: OPTION_CONFIG,
    userOptions: config,
    prefix: MESSAGE_PREFIX,
    suffix: MESSAGE_SUFFIX,
  });
  return _mergeOptions(validConfig);
}

export default mergeOptions;
