var vows = require('vows'),
  assert = require('assert'),
  assets = require('../index');

var rootPath = process.cwd() + '/test/data/';

function fullPathTo(assetName) {
  return rootPath + assetName;
};

function expand(list) {
  return assets.expand(list, { root: rootPath });
};

vows.describe('expanding assets').addBatch({
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
    topic: expand('1.css'),
    'should get array with one element': function(expanded) {
      assert.length(expanded, 1);
    },
    'should get full path to 1.css': function(expanded) {
      assert.equal(expanded[0], fullPathTo('1.css'));
    }
  }
}).export(module);