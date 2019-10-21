# Option Merger and Validator

This helper designed for merging user options into target object with fallback to default value and giving a warning message, describing what was wrong and what value expects. Resulting options always trustworthy because they're passing validation.

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
<script src="https://unpkg.com/@dubaua/merge-options@0.0.2/dist/mergeOptions.min.umd.js"></script>
```

# Usage

```js
import mergeOptions from '@dubaua/merge-options';

// describe defaults
const DEFAULTS = {
  pagerThreshold: {
    initial: 0.5,
    description: 'a number between 0 and 1',
    validator: x => typeof x === 'number' && 0 <= x && x <= 1,
  },
}

class Library {
  constructor(options) {
    this.options = {};
    // use it in your code
    mergeOptions({ 
      options,
      defaults: DEFAULTS,
      target: this.options,
      warnPreffix: 'Library: ',
      warnSuffix: 'Check out documentation https://github.com/dubaua/merge-options',
    });
  }
}

// pass user options to your code
const libraryInstance = new Library({ pagerThreshold: 1 });

// when options passes validation it will be merged to options
libraryInstance.options.pagerThreshold // 1

// pass invalid options to your code
const anotherInstance = new Library({ pagerThreshold: false });

// when options fails validation default value will be merged
// and user will see warning with clues what's wrong
anotherInstance.options.pagerThreshold // 0.5
// Library: Expected pagerThreshold is a number between 0 and 1,
// got boolean false. Fallback to default value 0.
// Check out documentation https://github.com/dubaua/merge-options
```
