!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sprout=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function assoc(obj, k, value) {
  if (obj[k] === value) return obj;
  var o = copy(obj);
  o[k] = value;
  return o;
}

module.exports = assoc;
},{"./util":17}],2:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    getIn = _dereq_('./getIn');

function assocIn(obj, keys, value) {
  if (getIn(obj, keys) === value) return obj;
  var k = keys[0],
      ks = keys.slice(1),
      o = copy(obj);
  if (ks.length) {
    o[k] = (k in o) ? assocIn(o[k], ks, value) : assocIn({}, ks, value);
  } else {
    o[k] = value;
  }
  return o;
}

module.exports = assocIn;
},{"./getIn":7,"./util":17}],3:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy,
    objectKeys = _dereq_('./util').objectKeys,
    isObject = _dereq_('./util').isObject,
    isArray = _dereq_('./util').isArray,
    isNull = _dereq_('./util').isNull,
    getIn = _dereq_('./getIn');

function deepMerge(obj, obj2) {
  var keys = objectKeys(obj2),
      n = keys.length,
      i = -1,
      o, o2, k;
  if (!n) return obj;
  o = copy(obj);
  while (++i < n) {
    k = keys[i];
    o2 = obj2[k];
    if (isObject(o2) && !isNull(o2)) {
      o[k] = (k in o) ? deepMerge(o[k], o2) : deepMerge(isArray(o2) ? [] : {}, o2); // Just assigning o2 to o[k] when k is not in o would be faster but less safe because we'd keep a reference to o2
    } else {
      o[k] = o2;
    }
  }
  return o;
}

function variadicDeepMerge() {
  var n = arguments.length,
      i = 0,
      o = arguments[0],
      obj;

  while (++i < n) {
    obj = arguments[i];
    o = deepMerge(o, obj);
  }

  return o;
}

module.exports = variadicDeepMerge;
},{"./getIn":7,"./util":17}],4:[function(_dereq_,module,exports){
var copy = _dereq_('./util').copy;

function dissoc(obj, k) {
  if(!(k in obj)) return obj;
  var o = copy(obj);
  delete o[k];
  return o;
}

module.exports = dissoc;
},{"./util":17}],5:[function(_dereq_,module,exports){
var util = _dereq_('./util'),
    hasIn = _dereq_('./hasIn');

function dissocIn(obj, keys) {
  if (!hasIn(obj, keys)) return obj;
  var k = keys[0],
      ks = keys.slice(1),
      o = util.copy(obj);
  if (ks.length) {
    o[k] = dissocIn(obj[k], ks);
    if (!util.objectKeys(o[k]).length) delete o[k];
  } else {
    delete o[k];
  }
  return o;
}

module.exports = dissocIn;
},{"./hasIn":8,"./util":17}],6:[function(_dereq_,module,exports){
var isNull = _dereq_('./util').isNull,
    isObject = _dereq_('./util').isObject;

function get(obj, k, orValue) {
  if (!isObject(obj) || isNull(obj) || !(k in obj)) return orValue;
  return obj[k];
}

module.exports = get;
},{"./util":17}],7:[function(_dereq_,module,exports){
var isNull = _dereq_('./util').isNull,
    isObject = _dereq_('./util').isObject;

// Get value from a nested structure or null.
function getIn(obj, keys, orValue) {
  var k = keys[0],
      ks = keys.slice(1);
  if (!isObject(obj) || isNull(obj) || !(k in obj)) return orValue;
  return ks.length ? getIn(obj[k], ks, orValue) : obj[k];
}

module.exports = getIn;
},{"./util":17}],8:[function(_dereq_,module,exports){
// Check if a nested property is present. Currently only used internally

function hasIn(obj, keys) {
  var k = keys[0],
      ks = keys.slice(1);
  if (ks.length) return !(k in obj) ? false : hasIn(obj[k], ks);
  return (k in obj);
}

module.exports = hasIn;
},{}],9:[function(_dereq_,module,exports){
var multiGet = _dereq_('./multiGet'),
    multiAssoc = _dereq_('./multiAssoc'),
    multiDissoc = _dereq_('./multiDissoc'),
    multiUpdate = _dereq_('./multiUpdate'),
    merge = _dereq_('./merge'),
    deepMerge = _dereq_('./deepMerge');

module.exports = {
  get: multiGet,
  assoc: multiAssoc,
  dissoc: multiDissoc,
  update: multiUpdate,
  merge: merge,
  deepMerge: deepMerge
};
},{"./deepMerge":3,"./merge":10,"./multiAssoc":11,"./multiDissoc":12,"./multiGet":13,"./multiUpdate":14}],10:[function(_dereq_,module,exports){
function merge() {
  var n = arguments.length,
      i = -1,
      o = {},
      k, obj;

  while (++i < n) {
    obj = arguments[i];
    for (k in obj) {
      o[k] = obj[k];
    }
  }

  return o;
}

module.exports = merge;
},{}],11:[function(_dereq_,module,exports){
var util = _dereq_('./util'),
    assoc = _dereq_('./assoc'),
    assocIn = _dereq_('./assocIn');

function multiAssoc(obj) {
  var n = arguments.length,
      i = -1,
      o = obj,
      path, value;

  while ((i += 2) < n) {
    path = arguments[i];
    value = arguments[i + 1];
    o = util.isArray(path) ? assocIn(o, path, value) : assoc(o, path, value);
  }

  return o;
}

module.exports = multiAssoc;
},{"./assoc":1,"./assocIn":2,"./util":17}],12:[function(_dereq_,module,exports){
var util = _dereq_('./util'),
    dissoc = _dereq_('./dissoc'),
    dissocIn = _dereq_('./dissocIn');

function multiDissoc(obj) {
  var n = arguments.length,
      i = 0,
      o = obj,
      path;

  while (++i < n) {
    path = arguments[i];
    o = util.isArray(path) ? dissocIn(o, path) : dissoc(o, path);
  }

  return o;
}

module.exports = multiDissoc;
},{"./dissoc":4,"./dissocIn":5,"./util":17}],13:[function(_dereq_,module,exports){
var util = _dereq_('./util'),
    get = _dereq_('./get'),
    getIn = _dereq_('./getIn');

function multiGet(obj, path, orValue) {
  if (util.isArray(path)) return getIn(obj, path, orValue);
  return get(obj, path, orValue);
}

module.exports = multiGet;
},{"./get":6,"./getIn":7,"./util":17}],14:[function(_dereq_,module,exports){
var util = _dereq_('./util'),
    update = _dereq_('./update'),
    updateIn = _dereq_('./updateIn');

function multiUpdate(obj, path, fn) {
  if (util.isArray(path)) return updateIn.apply(this, arguments);
  return update.apply(this, arguments);
}

module.exports = multiUpdate;
},{"./update":15,"./updateIn":16,"./util":17}],15:[function(_dereq_,module,exports){
var get = _dereq_('./get'),
    assoc = _dereq_('./assoc');

function update(obj, k, fn) {
  var args = Array.prototype.slice.call(arguments, 3),
      value = get(obj, k);
  return assoc(obj, k, fn.apply(value, [value].concat(args)));
}

module.exports = update;
},{"./assoc":1,"./get":6}],16:[function(_dereq_,module,exports){
var getIn = _dereq_('./getIn'),
    assocIn = _dereq_('./assocIn');

function updateIn(obj, keys, fn) {
  var args = Array.prototype.slice.call(arguments, 3),
      value = getIn(obj, keys);
  return assocIn(obj, keys, fn.apply(value, [value].concat(args)));
}

module.exports = updateIn;
},{"./assocIn":2,"./getIn":7}],17:[function(_dereq_,module,exports){
var _toString = {}.toString;

var isArray = Array.isArray || function(arr) { return _toString.call(arr) === '[object Array]'; };

function isObject(obj) {
  return typeof obj === 'object';
}

function isUndefined(v) {
  return v === void 0;
}

function isNull(v) {
  return v === null;
}

// Shallow copy
function copy(obj) {
  if (isArray(obj)) return obj.slice();
  var k,
      newObj = {};
  for (k in obj) {
    newObj[k] = obj[k];
  }
  return newObj;
}

function objectKeys(obj) {
  var keys = [], k;
  for (k in obj) {
    keys.push(k);
  }
  return keys;
}

module.exports = {
  copy: copy,
  objectKeys: objectKeys,
  isObject: isObject,
  isArray: isArray,
  isUndefined: isUndefined,
  isNull: isNull
};
},{}]},{},[9])
(9)
});