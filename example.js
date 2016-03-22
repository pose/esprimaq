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

syntax = esprima.parse('this.foo(bar);', {tolerant: true, loc: true});
result = find(syntax).callThisMethod('foo').exec();
assert.equal('bar', result[0].arguments[0].name);

syntax = esprima.parse('(function (a,b,c,d) { var x; console.log(x, y, z); t++; e(); d--; })();');
result = find(syntax).identifiers().exec();
assert.equal(13, result.length);
assert.equal('a', result[0].name);
assert.equal('b', result[1].name);
assert.equal('d', result[12].name);

syntax = esprima.parse('(function (a,b,c,d) { var x; console.log(x, y, z); t++; e(); d--; })();');
var functionArguments = find(syntax).fnExpressions().exec();
// Get all function arguments
functionArguments = functionArguments.reduce(function (list, fn) {
  list = list.concat(fn.params);
  return list;
}, []);

// Find the identifiers that have been declared
functionArguments = functionArguments.reduce(function (d, identifier) {
  d[identifier.name] = true;
  return d;
}, {});

// Get the list of the global or not bound identifiers
// TODO Fix me for the case of console.log that it detects `console`
// and `log` as two different entitites.
result = result.filter(function (r) {
  return find(syntax).varDecl(r.name).exec().length === 0 && !functionArguments[r.name];
});

var memberExpression = syntax.body[0].expression.callee.body.body[1].expression.callee;
assert.equal(memberExpression.object.name, 'console');
assert.equal(memberExpression.property.name, 'log');

// Get a list of unique identifiers
var uniqueIdentifiers = result.map(function (identifier) {
  return identifier.name;
});

assert.equal(uniqueIdentifiers.length, 6);
assert.equal(uniqueIdentifiers[2], 'y');
