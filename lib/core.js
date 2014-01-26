Array.prototype.unique = function() {
  var uniques = [];
  this.forEach(function(value) {
    if (uniques.indexOf(value) == -1)
      uniques.push(value);
  });
  return uniques;
};

Object.each = function(object, callback, scope) {
  for (var key in object) {
    callback.call(scope, key, object[key]);
  }
};

Object.clone = function(object) {
  var clone = {};
  Object.each(object, function(key, value) {
    clone[key] = value;
  });
  return clone;
};

Object.merge = function(object1, object2) {
  var target = Object.clone(object1);
  Object.each(object2, function(key, value) {
    target[key] = value;
  });
  return target;
};
