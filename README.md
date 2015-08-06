## xregexp-lookbehind

A tiny node wrapper around [slevithan's lookbehind
implementation](https://gist.github.com/slevithan/2387872).

### Usage

```js
var merge = require('lodash.merge');
var XRegExp = require('xregexp').XRegExp;

merge(XRegExp, require('xregexp-lookbehind'));

console.log(XRegExp.matchAllLb("Catwoman's cats are fluffy cats", '(?i)(?<!fluffy\\W+)', /cat\w*/i));
// ['Catwoman', 'cats']
```
