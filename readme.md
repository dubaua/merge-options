# Option Merger and Validator

This helper designed for validate user options with fallback to default values and giving a warning message, describing what was wrong and what values are expecting. You describe a validator, description and default value for each option and then pass user options. Resulting options always trustworthy because they're either passing validation or defaults.

# Reasoning

Everyone hates to get error messages. The worst thing is passing error silently, but error messages not giving you clues are useless as well. Once Internet Explorer pissed me off with its `Unsupported Error`.

When I was developing [immerser](https://github.com/dubaua/immerser) I thought about how to throw user-friendly errors. I wanted to save user time on debugging my library. Stack trace gives you exact error position and message should give comprehensive information what is expecting, what was passed. Whats why I made this helper.

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
<script src="https://unpkg.com/@dubaua/merge-options@1.0.0/dist/merge-options.min.umd.js"></script>
```

# Parameters and Return

Function acceps the only parameter — a configuration object described below. It returns an object with all keys in default options. User value passing validation overrides corresponding initial value in defaults.

| option      | type                             | description                                                                                           |
| ----------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| defaults    | `Object.<string, DefaultOption>` | Required. Default options. An object with objects each type of DefaultOption described in table below |
| userOptions | `Object`                         | Required. User options needs validation before merge                                                  |
| warnPreffix | `string`                         | String before warning message, useful to pass name of tool                                            |
| warnSuffix  | `string`                         | String after warning message, useful to pass link to documentation                                    |

## DefaultOption

Each default option have necessary information to validation and showing warning message

| name        | type       | description                                                      |
| ----------- | ---------- | ---------------------------------------------------------------- |
| initial     | `any`      | Initial value for fallback if user option fail validation        |
| description | `string`   | Validator description for human                                  |
| validator   | `function` | Function for validating user option. Should return boolean value |

# Usage

## Import Helper to Your Code

```js
import mergeOptions from '@dubaua/merge-options';
```

## Describe Default Options

Create an object with default options. Each option should have initial value, description and validator function.

```js
const DEFAULT_LIBRARY_OPTIONS = {
  pagerThreshold: {
    initial: 0.5,
    description: 'a number between 0 and 1',
    validator: x => typeof x === 'number' && 0 <= x && x <= 1,
  },
};
```

## Merge User Options with Defaults

```js
class Library {
  constructor(userOptions) {
    this.options = mergeOptions({
      userOptions,
      defaults: DEFAULT_LIBRARY_OPTIONS,
      warnPreffix: 'Library',
      warnSuffix: 'Check out documentation https://github.com/dubaua/merge-options',
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

If invalid options passed user will see friendly warnings. And also library will work, but with default options.

```js
// pass invalid options to your code
const anotherInstance = new Library({ pagerThreshold: false });

// when options fails validation default value will be merged
// and user will see warning with clues what's wrong
anotherInstance.options.pagerThreshold; // 0.5
// Library: Expected pagerThreshold is a number between 0 and 1,
// got boolean false. Fallback to default value 0.
// Check out documentation https://github.com/dubaua/merge-options
```
