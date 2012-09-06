var fs = require('fs'),
  path = require('path'),
  yaml = require('../vendor/yaml'),
  existsSync = fs.existsSync || path.existsSync;

var AssetsExpander = function(pathToYaml, options) {
  if (!pathToYaml) return;

  try {
    this.yamlSource = yaml.eval(fs.readFileSync(pathToYaml, 'utf-8'));
  } catch (e) {
    throw new AssetsExpander.YamlSyntaxError(e.toString());
  }

  this.options = options;
};

AssetsExpander.prototype = {
  allTypes: function() {
    return Object.keys(this.yamlSource || {});
  },

  groupsFor: function(type) {
    return Object.keys(this.yamlSource[type] || {});
  },

  processList: function(mainGroup, options) {
    options = options || this.options || {};
    var self = this;

    var expandAsset = function(root, asset) {
      var matches = [];

      if (asset.indexOf('**/*') > -1) {
        var prefix = asset.substring(0, asset.indexOf('**/*'));
        self._scanDir(path.join(root, prefix), '*', true, options.type).forEach(function(matched) {
          matches.push(matched);
        });
      } else if (asset.indexOf('*') > -1) {
        var prefix = '';
        if (asset.indexOf('/') > -1) {
          prefix = asset.substring(0, asset.lastIndexOf('/'));
          asset = asset.substring(prefix.length + 1);
        }
        self._scanDir(path.join(root, prefix), asset, false, options.type).forEach(function(matched) {
          matches.push(matched);
        });
      } else {
        var expanded = path.join(root, asset) + '.' + options.type;
        if (existsSync(expanded)) matches.push(expanded);
      }

      return matches;
    };

    var expandGroup = function(root, group) {
      var groupAssets = [];

      if (group.indexOf('[') > -1) {
        var tokens = group.split(/[\[\]]/);
        root = path.join(root, tokens[0]);
        group = tokens[1];
      }

      group.split(',').forEach(function(asset) {
        expandAsset(root, asset).forEach(function(expanded) {
          groupAssets.push(expanded);
        });
      });

      return groupAssets;
    };

    return expandGroup(options.root, mainGroup).unique();
  },

  processGroup: function(type, name, localOptions) {
    if (!this.yamlSource[type])
      throw new AssetsExpander.UnknownTypeError("Unknown type: '" + type + "'");

    if (!this.yamlSource[type][name])
      throw new AssetsExpander.UnknownGroupError("Unknown group: '" + name + "' for type '" + type + "'");

    var definition = this.yamlSource[type][name],
      assets = [],
      options = Object.merge(Object.clone(this.options), localOptions || {}),
      self = this;

    options.root = path.join(options.root, localOptions.path || type);

    var processLevel = function(levelDefinition, levelOptions) {
      if (typeof levelDefinition == 'string') {
        self.processList(levelDefinition, levelOptions).forEach(function(asset) {
          assets.push(asset);
        });
      } else if (levelDefinition instanceof Array) {
        levelDefinition.forEach(function(value) {
          processLevel(value, levelOptions);
        });
      } else { // Hash
        Object.each(levelDefinition, function(key, value) {
          processLevel(value, Object.merge(levelOptions, { root: path.join(levelOptions.root, key) }));
        });
      }
    };

    processLevel(definition, options);

    return assets.unique();
  },

  // private

  _scanDir: function(root, pathToDir, recursive, extension) {
    var pattern = new RegExp('^' + pathToDir.replace(/\*/, '.*'), 'g'),
      extPattern = new RegExp(extension + '$'),
      dirs = [],
      matches = [],
      self = this;

    fs.readdirSync(path.join(root, path.dirname(pathToDir))).forEach(function(match) {
      var fullPath = path.join(root, match),
        stat = fs.lstatSync(fullPath);

      if (match.match(pattern) && match.match(extPattern) && !stat.isDirectory())
        matches.push(fullPath);
      if (stat.isDirectory())
        dirs.push(fullPath);
    });

    if (recursive) {
      dirs.forEach(function(dir) {
        self._scanDir(dir, '*', true, extension).forEach(function(match) {
          matches.push(match);
        });
      });
    }

    return matches;
  }
};

AssetsExpander.YamlSyntaxError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'YamlSyntaxError';
  this.message = message;
};
AssetsExpander.YamlSyntaxError.prototype.__proto__ = Error.prototype;

AssetsExpander.UnknownGroupError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'UnknownGroupError';
  this.message = message;
};
AssetsExpander.UnknownGroupError.prototype.__proto__ = Error.prototype;

AssetsExpander.UnknownTypeError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'UnknownTypeError';
  this.message = message;
};
AssetsExpander.UnknownTypeError.prototype.__proto__ = Error.prototype;

module.exports = AssetsExpander;

// Core extensions
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