var fs = require('fs'),
  path = require('path');

var Assets = {
  expand: function(group, options) {
    var assets = [];
    options = options || {};
    
    group.split(' ').forEach(function(asset) {
      if (asset.length == 0) return;
      
      assets.push(path.join(options.root, asset));
    });
    
    return assets;
  }
};

module.exports = Assets;