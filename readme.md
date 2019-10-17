# Option Merger and Validator

This helper designed for merging user options into target object with fallback to default value and giving a warning message, describing what was wrong and what value expects. Resulting options always trustworthy because they're passing validation.

```js
import mergeOptions from 'mergeOptions';

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
    mergeOptions({ 
      options,
      defaults: DEFAULTS,
      target: this.options,
      warnPreffix: 'Library: ',
      warnSuffix: 'Check out documentation https://github.com/dubaua/merge-options',
    });
  }
}

// when options passes validation it will be merged to options
const libraryInstance = new Library({ pagerThreshold: 1 });
libraryInstance.options.pagerThreshold // 1

// when options fails validation default value will be merged and user will see warning with clues what's wrong
const anotherInstance = new Library({ pagerThreshold: false });
anotherInstance.options.pagerThreshold // 0.5
// Library: Expected pagerThreshold is a number between 0 and 1, got boolean false. Fallback to default value 0. Check out documentation https://github.com/dubaua/merge-options
```
