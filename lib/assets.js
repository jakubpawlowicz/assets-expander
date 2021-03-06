/**
 * assets-expander - https://github.com/jakubpawlowicz/assets-expander
 * Released under the terms of MIT license
 *
 * Copyright (C) 2014 JakubPawlowicz.com
 */

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

require('./core');

var AssetsExpander = function(pathToYaml, options) {
  this.options = options;
  this.sortingFix = /0\.8\./.test(process.versions.node);

  if (pathToYaml) {
    try {
      this.yamlSource = yaml.safeLoad(fs.readFileSync(pathToYaml, 'utf-8'));
    } catch (e) {
      throw new AssetsExpander.YamlSyntaxError(e);
    }
  }
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
      var prefix;

      if (asset.indexOf('**/*') > -1) {
        prefix = asset.substring(0, asset.indexOf('**/*'));
        self._scanDir(path.join(root, prefix), '*', true, options.type).forEach(function(matched) {
          matches.push(matched);
        });
      } else if (asset.indexOf('*') > -1) {
        prefix = '';
        if (asset.indexOf('/') > -1) {
          prefix = asset.substring(0, asset.lastIndexOf('/'));
          asset = asset.substring(prefix.length + 1);
        }
        self._scanDir(path.join(root, prefix), asset, false, options.type).forEach(function(matched) {
          matches.push(matched);
        });
      } else {
        var expanded = path.join(root, asset) + '.' + options.type;
        if (fs.existsSync(expanded)) matches.push(expanded);
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
      throw new AssetsExpander.UnknownTypeError('Unknown type: \'' + type + '\'');

    if (!this.yamlSource[type][name])
      throw new AssetsExpander.UnknownGroupError('Unknown group: \'' + name + '\' for type \'' + type + '\'');

    var definition = this.yamlSource[type][name];
    var assets = [];
    var options = Object.merge(Object.clone(this.options), localOptions || {});
    var self = this;

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
    var pattern = new RegExp('^' + pathToDir.replace(/\*/, '.*'), 'g');
    var extPattern = new RegExp(extension + '$');
    var dirs = [];
    var matches = [];
    var self = this;

    fs.readdirSync(path.join(root, path.dirname(pathToDir))).forEach(function(match) {
      var fullPath = path.join(root, match),
        stat = fs.lstatSync(fullPath);

      if (match.match(pattern) && match.match(extPattern) && !stat.isDirectory())
        matches.push(fullPath);
      if (stat.isDirectory())
        dirs.push(fullPath);
    });

    if (this.sortingFix)
      matches = matches.sort();

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

AssetsExpander.YamlSyntaxError = function(e) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'YamlSyntaxError';
  this.message = e.message;

  return this;
};
AssetsExpander.YamlSyntaxError.prototype = new Error();

AssetsExpander.UnknownGroupError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'UnknownGroupError';
  this.message = message;

  return this;
};
AssetsExpander.UnknownGroupError.prototype = new Error();

AssetsExpander.UnknownTypeError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = 'UnknownTypeError';
  this.message = message;

  return this;
};
AssetsExpander.UnknownTypeError.prototype = new Error();

module.exports = AssetsExpander;
