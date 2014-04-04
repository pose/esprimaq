var assert = require('assert');

var esprima = require('esprima');
var find = require('./index');

var syntax;
var result;

syntax = esprima.parse("mongo('hello');", { tolerant: true, loc: true });
result = find(syntax).callFn('mongo').exec();
assert.equal('hello', result[0].arguments[0].value);

syntax = esprima.parse("var x = 5;", { tolerant: true, loc: true });
result = find(syntax).varDecl('x').exec();
assert.equal('5', result[0].init.value);

syntax = esprima.parse("hello.bye(w00t);", { tolerant: true, loc: true });
result = find(syntax).callMethod('hello', 'bye').exec();
assert.equal('w00t', result[0].arguments[0].name);
