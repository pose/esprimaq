function traverse(object, visitor) {
    var key, child;

    if (visitor.call(null, object) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

module.exports = function (syntax) {
  function makeCascade(fn) {
    this.criteria.push(fn);

    return this;
  }
  var d = {
    criteria: [],

    /* Find calls to a function named *fnName* */
    callFn: function (fnName) {
      this.criteria.push(function (node) {
        return node.type === 'CallExpression' && (fnName ? node.callee.name === fnName : true);
      });

      return this;
    },

    /* Find assingments: lvalue = {data}; */
    varDecl: function (lvalue) {
      this.criteria.push(function (node) {
        return node.type === 'VariableDeclarator' && node.id.name === lvalue;
      });

      return this;
    },

    /* Find calls to a method: obj, methodName  -> obj.methodName() */
    callMethod: function (obj, methodName) {
      this.criteria.push(function (node) {
        return node.type === 'CallExpression' && node.callee.type === 'MemberExpression' &&
          node.callee.object.name === obj && node.callee.property.name === methodName;
      });

      return this;
    },

    /* Execute query */
    exec: function () {
      var nodesToReturn = [];
      var that = this;

      traverse(syntax, function (node) {
        var matches = that.criteria.filter(function (criterion) { return criterion(node); });
        if (matches.length > 0) {
          nodesToReturn.push(node);
        }
      });

      return nodesToReturn;
    }
  };

  return d;
};

