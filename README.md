## esprimaq (BETA)

Query esprima ASTs by using a chainable query syntax.

### Install

```sh
  npm install esprimaq
```

### Usage

```js
var find = require('esprimaq');
```

Find function calls of the `mongo` function:
```js
var syntax = esprima.parse("mongo('hello');", {tolerant: true});
var result = find(syntax).callFn('mongo').exec();
assert.equal('hello', result[0].arguments[0].value);
```

Find variable declarations of `x`:
```js
var syntax = esprima.parse("var x = 5;", {tolerant: true});
var result = find(syntax).varDecl('x').exec();
assert.equal('5', result[0].init.value);
```

Find calls to `hello.bye`:
```js
var syntax = esprima.parse("hello.bye(w00t);", {tolerant: true});
var result = find(syntax).callMethod('hello', 'bye').exec();
assert.equal('w00t', result[0].arguments[0].name);
```

Find calls using `this`:
```js
var syntax = esprima.parse('this.foo(bar);', {tolerant: true});
var result = find(syntax).callThisMethod('foo').exec();
assert.equal('bar', result[0].arguments[0].name);
```

### TODO
  * Implement tons of selectors:
    * Identifier
    * CallExpression
    * ExpressionStatement
    * AssignmentExpression
    * Literal
    * Property
    * Identifier
    * among others
  * Implement way of doing `AND` in queries


### FAQ

#### Why another esprima query/selector library?
I wanted a simpler and CSS-selector-free alternative to query esprima ASTs.

#### Do you know any cool CSS-based alternatives?
Yes, check these projects:
  * [esquery](https://github.com/jrfeenst/esquery)
  * [esprima-selector](https://github.com/alltom/esprima-selector)


### Changelog

#### 0.1.0

##### Added

 * Adding support for `callThisMethod`, `fnExpressions` and `identifiers` filters.

#### 0.0.1

* Initial Release

### License
(The MIT License)

Copyright (c) 2014-2016 Alberto Pose < albertopose at gmail.com >

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
