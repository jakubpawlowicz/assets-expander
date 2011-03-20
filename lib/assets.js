var fs = require('fs'),
  path = require('path'),
  yaml = require('../vendor/yaml'),
  rightjs = require('rightjs');

var AssetsExpander = function(pathToYaml, options) {
  if (pathToYaml) {
    this.yamlSource = yaml.eval(fs.readFileSync(pathToYaml).toString());
    this.options = options;
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
      
      if (asset.includes('**/*')) {
        var prefix = asset.substring(0, asset.indexOf('**/*'));
        matches.push(self._scanDir(path.join(root, prefix), '*', true));
      } else if (asset.includes('*')) {
        var prefix = '';
        if (asset.indexOf('/') >= 0) {
          prefix = asset.substring(0, asset.indexOf('*'));
          asset = '*';
        }
        matches.push(self._scanDir(path.join(root, prefix), asset));
      } else {
        var expanded = path.join(root, asset) + '.' + options.type;
        if (path.existsSync(expanded)) matches.push(expanded);
      }
      
      return matches;
    };
    
    var expandGroup = function(root, group) {
      var groupAssetsExpander = [];
      
      if (group.includes('[')) {
        var tokens = group.split(/[\[\]]/);
        root = path.join(root, tokens[0]);
        group = tokens[1];
      }
      
      group.split(',').forEach(function(asset) {
        var expanded = expandAsset(root, asset);
        if (expanded.length == 0) return;
        
        groupAssetsExpander.push(expanded);
      });
      
      return groupAssetsExpander;
    };
    
    return expandGroup(options.root, mainGroup).flatten().uniq();
  },
  
  processGroup: function(type, name) {
    var definition = this.yamlSource[type][name],
      assets = [],
      options = Object.clone(this.options),
      self = this;
      
    options.root = path.join(options.root, type);
    
    var processLevel = function(levelDefinition, levelOptions) {
      if (rightjs.isString(levelDefinition)) {
        assets.push(self.processList(levelDefinition, levelOptions));
      } else if (rightjs.isHash(levelDefinition)) {
        Object.each(levelDefinition, function(key, value) {
          processLevel(value, Object.merge(levelOptions, { root: path.join(levelOptions.root, key) }));
        });
      } else { // Array
        levelDefinition.each(function(value) {
          processLevel(value, levelOptions);
        });
      }
    };
    
    processLevel(definition, options);
    
    return assets.flatten();
  },
  
  // private
  
  _scanDir: function(root, pathToDir, recursive) {
    var pattern = new RegExp('^' + pathToDir.replace(/\*/, '.*'), 'g'),
      dirs = [],
      matches = [],
      self = this;
    
    fs.readdirSync(path.join(root, path.dirname(pathToDir))).forEach(function(match) {
      var fullPath = path.join(root, match),
        stat = fs.lstatSync(fullPath);
      
      if (match.match(pattern) && !stat.isDirectory())
        matches.push(fullPath);
      if (stat.isDirectory())
        dirs.push(fullPath);
    });
    
    if (recursive) {
      dirs.forEach(function(dir) {
        matches.push(self._scanDir(dir, '*', true));
      });
    }
    
    return matches;
  }
};

module.exports = AssetsExpander;