# Parameters and Props Validator for Open Source Developers

This tool designed for validating user options against declarative configuration. To show how it is designed I introduce two characters. A developer of a library and a consumer of the library. The first uses merge-options internally and delegate it user options validation. The developer describes the options accepting by the library in declarative way. Each option either required or has default value, have a validator function and description of the validator. The developer can be sure that the library will get valid options passed through merge-options. Also, the developer can be sure the consumer will get verbose exceptions or warnings if they will pass invalid options or will forget to pass required options.

# Reasoning

It saves the developer time on validation props and saves the consumer time on debugging.

# How it Works

The function iterates over option configuration and looks for user option with same key. If the user option pass validation the function writes user value to a resulting object key. If the option isn't required, so the function writes default value to the resulting object key. If the user option fails validation or the user didn't pass required option the function throws an exception with a verbose message. If all options validation the function returns the resulting object.

Merge-options uses itself internally to validate its options :)

# Installation

Using npm

```bash
npm i @dubaua/merge-options
```

or yarn

```bash
yarn add @dubaua/merge-options
```

or if you want to use package as UMD

```html
<script src="https://unpkg.com/@dubaua/merge-options@2.0.0/dist/merge-options.min.umd.js"></script>
```

# Parameters and Return

The function accepts the only parameter — a configuration object described below. It returns an object with all keys in options. User value passing validation overrides corresponding initial value in defaults.

| option       | type                      | default | description                                                                                                                                                           |
| ------------ | ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| optionConfig | `Object.<string, Option>` |         | required. declarative option configuration                                                                                                                            |
| userOptions  | `Object`                  | `{}`    | user options needs validation before merge                                                                                                                            |
| preffix      | `string`                  | `''`    | string before an error or warning message                                                                                                                             |
| suffix       | `string`                  | `''`    | string after an error or warning message                                                                                                                              |
| strict       | `boolean`                 | `true`  | in strict mode if user value fails validation the function throws an exception. In not strict mode the function shows a warning message and fallback to default value |

## Option

Each option configuration have necessary information to validation and composing message

| name        | type               | description                                                                                                                          |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| required    | `boolean|function` | a flag or function accepts `userOptions`                                                                                             |
| default     | `any`              | default value for fallback if user option fail validation                                                                            |
| validator   | `function`         | function for validating user option. Accepts `userValue` as first argument and `userOptions` as second. Should return boolean value. |
| description | `string`           | human readable validator description. Uses to compose an error message and warning                                                   |

# Usage

## Import to Your Code

If you're using merge-options as UMD you don't have to import. It accessible as global function mergeOptions.

```js
import mergeOptions from '@dubaua/merge-options';
```

## Describe Default Options

Create an object with option configuration. Each option should have initial value, description and validator function.

```js
const LIBRARY_OPTION_CONFIG = {
  pagerThreshold: {
    default: 0.5,
    validator: (x) => typeof x === 'number' && 0 <= x && x <= 1,
    description: 'a number between 0 and 1',
  },
};

class Library {
  constructor(userOptions) {
    this.options = mergeOptions({
      optionConfig: LIBRARY_OPTION_CONFIG,
      userOptions,
      preffix: '[Library]:',
      suffix: 'Check out documentation https://github.com/dubaua/merge-options',
      strict: false,
    });
  }
}
```

Now, everyone can pass options to your library.

```js
// passing valid options to library
const libraryInstance = new Library({ pagerThreshold: 1 });
// options passing validation overrides defaults
libraryInstance.options.pagerThreshold; // 1
```

If invalid option passed user will see a warning in not strict mode and exceptions in strict.

```js
// pass invalid options to your code
const anotherInstance = new Library({ pagerThreshold: 1.5 });
// [Library]: Expected pagerThreshold to be a number between 0 and 1,
// got number 1.5. Fallback to default value 0.5.
// Check out documentation https://github.com/dubaua/merge-options
anotherInstance.options.pagerThreshold; // 0.5
```

## Validation Based on Another Option

In example below startPosition option validator relies on inputRange value.

```js
const OPTION_CONFIG = {
  inputRange: {
    required: true,
    validator: (x) => Array.isArray(x) && x.length === 2 && x.every((y) => typeof y === 'number'),
    description: 'an array of two numbers',
  },
  startPosition: {
    required: (userOptions) => Object.prototype.hasOwnProperty.call(userOptions, 'inputRange'),
    default: 0,
    validator: (value, userOptions) =>
      Object.prototype.hasOwnProperty.call(userOptions, 'inputRange')
        ? userOptions.inputRange[0] <= value && value <= userOptions.inputRange[1]
        : true,
    description: 'an number within inputRange',
  },
};
```
