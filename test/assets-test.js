var vows = require('vows'),
  assert = require('assert'),
  AssetsExpander = require('../index'),
  fs = require('fs'),
  path = require('path');

var rootPath = process.cwd() + '/test/assets/';

function fullPathTo(assetName) {
  return path.join(rootPath, 'stylesheets', assetName + '.css');
};

function expand(list) {
  return new AssetsExpander().processList(list, { root: path.join(rootPath, 'stylesheets'), type: 'css' });
};

function expanderFor(name) {
  return new AssetsExpander(path.join(process.cwd(), 'test', 'assets', name), { root: rootPath });
};

function group(groupId) {
  return expanderFor('assets.yml').processGroup('stylesheets', groupId, { type: 'css' });
};

exports.listsSuite = vows.describe('expanding assets').addBatch({
  'expand empty': {
    topic: expand(''),
    'should get array': function(expanded) {
      assert.isArray(expanded)
    },
    'should get empty list': function(expanded) {
      assert.isEmpty(expanded);
    }
  },
  'expand single file': {
    topic: expand('asset1'),
    'should get array with one element': function(expanded) {
      assert.length(expanded, 1);
    },
    'should get full path to 1.css': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset1'));
    }
  },
  'expanding three files': {
    topic: expand('asset1,asset3,asset2'),
    'should give array of three files': function(expanded) {
      assert.length(expanded, 3);
    },
    'should give three files in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset1'));
      assert.equal(expanded[1], fullPathTo('asset3'));
      assert.equal(expanded[2], fullPathTo('asset2'));
    }
  },
  'expanding missing files': {
    topic: expand('asset-missing1,asset-missing2'),
    'should give empty list': function(expanded) {
      assert.isEmpty(expanded);
    }
  },
  'expanding single level wildcard arguments': {
    topic: expand('*'),
    'should give three assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give files in natural order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset1'));
      assert.equal(expanded[1], fullPathTo('asset2'));
      assert.equal(expanded[2], fullPathTo('asset3'));
      assert.equal(expanded[3], fullPathTo('other-asset'));
    }
  },
  'expanding single level custom wildcard arguments': {
    topic: expand('asset*'),
    'should give three assets': function(expanded) {
      assert.length(expanded, 3);
    },
    'should give files in natural order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset1'));
      assert.equal(expanded[1], fullPathTo('asset2'));
      assert.equal(expanded[2], fullPathTo('asset3'));
    }
  },
  'expanding single level list with wildcard': {
    topic: expand('asset2,other-asset,*'),
    'should give 4 assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give assets in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset2'));
      assert.equal(expanded[1], fullPathTo('other-asset'));
      assert.equal(expanded[2], fullPathTo('asset1'));
      assert.equal(expanded[3], fullPathTo('asset3'));
    }
  },
  'expanding multi level wildcard argument': {
    topic: expand('**/*'),
    'should give 8 assets': function(expanded) {
      assert.length(expanded, 8);
    },
    'should give files in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset1'));
      assert.equal(expanded[1], fullPathTo('asset2'));
      assert.equal(expanded[2], fullPathTo('asset3'));
      assert.equal(expanded[3], fullPathTo('other-asset'));
      assert.equal(expanded[4], fullPathTo('folder1/asset4'));
      assert.equal(expanded[5], fullPathTo('folder1/asset5'));
      assert.equal(expanded[6], fullPathTo('folder1/other'));
      assert.equal(expanded[7], fullPathTo('folder1/subfolder1/asset6'));
    }
  },
  'expanding multi level wildcard with prefix': {
    topic: expand('folder1/**/*'),
    'should give 4 assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give files in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('folder1/asset4'));
      assert.equal(expanded[1], fullPathTo('folder1/asset5'));
      assert.equal(expanded[2], fullPathTo('folder1/other'));
      assert.equal(expanded[3], fullPathTo('folder1/subfolder1/asset6'));
    }
  },
  'expanding sublevel list': {
    topic: expand('folder1/[asset5,subfolder1/*,*]'),
    'should give 4 assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give files in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('folder1/asset5'));
      assert.equal(expanded[1], fullPathTo('folder1/subfolder1/asset6'));
      assert.equal(expanded[2], fullPathTo('folder1/asset4'));
      assert.equal(expanded[3], fullPathTo('folder1/other'));
    }
  }
});

exports.groupsSuite = vows.describe('expanding assets groups').addBatch({
  'expanding group #1 from assets.yml': {
    topic: group('desktop/public1'),
    'should give 5 assets': function(expanded) {
      assert.length(expanded, 5);
    },
    'should give in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset3'));
      assert.equal(expanded[1], fullPathTo('asset2'));
      assert.equal(expanded[2], fullPathTo('asset1'));
      assert.equal(expanded[3], fullPathTo('other-asset'));
      assert.equal(expanded[4], fullPathTo('folder1/subfolder1/asset6'));
    }
  },
  'expanding group #2 from assets.yml': {
    topic: group('desktop/public2'),
    'should give 2 assets': function(expanded) {
      assert.length(expanded, 2);
    },
    'should give in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('folder1/asset5'));
      assert.equal(expanded[1], fullPathTo('folder1/subfolder1/asset6'));
    }
  },
  'expanding group #3 from assets.yml': {
    topic: group('desktop/public3'),
    'should give 4 assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('asset3'));
      assert.equal(expanded[1], fullPathTo('folder1/asset5'));
      assert.equal(expanded[2], fullPathTo('folder1/asset4'));
      assert.equal(expanded[3], fullPathTo('folder1/subfolder1/asset6'));
    }
  },
  'expanding group #4 from assets.yml': {
    topic: group('desktop/public4'),
    'should give 4 assets': function(expanded) {
      assert.length(expanded, 4);
    },
    'should give in proper order': function(expanded) {
      assert.equal(expanded[0], fullPathTo('folder1/asset4'));
      assert.equal(expanded[1], fullPathTo('folder1/asset5'));
      assert.equal(expanded[2], fullPathTo('folder1/other'));
      assert.equal(expanded[3], fullPathTo('folder1/subfolder1/asset6'));
    }
  }
});

exports.listAllSuite = vows.describe('getting all groups and assets').addBatch({
  'list of types from assets.yml file': {
    topic: expanderFor('assets.yml').allTypes(),
    'should get array': function(types) {
      assert.isArray(types);
    },
    'should not be empty': function(types) {
      assert.isNotNull(types);
    },
    'should have two elements': function(types) {
      assert.equal(types[0], 'stylesheets');
      assert.equal(types[1], 'javascripts');
    }
  },
  'list of types from empty.yml file': {
    topic: expanderFor('empty.yml').allTypes(),
    'should be empty': function(types) {
      assert.isEmpty(types);
    }
  },
  'list of stylesheet groups from assets.yml file': {
    topic: expanderFor('assets.yml').groupsFor('stylesheets'),
    'should get array': function(groups) {
      assert.isArray(groups);
    },
    'should get four results': function(groups) {
      assert.equal(groups[0], 'desktop/public1')
      assert.equal(groups[1], 'desktop/public2')
      assert.equal(groups[2], 'desktop/public3')
      assert.equal(groups[3], 'desktop/public4')
    }
  },
  'list of javascript groups from assets.yml file': {
    topic: expanderFor('assets.yml').groupsFor('stylesheets'),
    'should get four results': function(groups) {
      assert.equal(groups[0], 'desktop/public1')
    }
  },
  'list of unknown groups from assets.yml file': {
    topic: expanderFor('assets.yml').groupsFor('unknown'),
    'should get empty results': function(groups) {
      assert.isEmpty(groups);
    }
  }
});