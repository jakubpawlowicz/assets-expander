[![NPM version](https://badge.fury.io/js/assets-expander.png)](https://badge.fury.io/js/assets-expander)
[![Build Status](https://secure.travis-ci.org/jakubpawlowicz/assets-expander.png)](https://travis-ci.org/jakubpawlowicz/assets-expander)
[![Dependency Status](https://david-dm.org/jakubpawlowicz/assets-expander.png?theme=shields.io)](https://david-dm.org/jakubpawlowicz/assets-expander)
[![devDependency Status](https://david-dm.org/jakubpawlowicz/assets-expander/dev-status.png?theme=shields.io)](https://david-dm.org/jakubpawlowicz/assets-expander#info=devDependencies)

## What is assets-expander?

Assets-expander is a Node.js library that turns a glob-like declarations from YAML file into a list of files.
Just see below for examples.

## Usage

### How to install assets-expander?

```
npm install assets-expander
```

### How to user assets-expander?

```js
var AssetsExpander = require('assets-expander');
var expander = new AssetsExpander('assets.yml', { root: 'path/to/public/dir' });
expander.processGroup('javascripts', 'public'); // gets a flat list of assets in public group
```

### How to define assets.yml file?

Just go with something like:

```yml
javascripts:
  public:
    vendor: 'undescore,modernizr'
    public: '**/*'
stylesheets:
  public:
    - 'reset,shared,base,home'
```

Then if you have the following directory structure:

```
javascripts
  - vendor
    - underscore.js
    - modernizr.js
  - public
    - main.js
    - fallback.js
stylesheets
  - reset.css
  - shared.css
  - base.css
  - home.css
```

then running the following code will give you the files you need:

```
> expander.processGroup('stylesheets', 'public')
> ['stylesheets/reset.css', 'stylesheets/shared.css', 'stylesheets/base.css', 'stylesheets/home.css']

> expander.processGroup('javascripts', 'public')
> ['javascripts/vendor/underscore.js', 'javascripts/vendor/modernizr.js', 'javascripts/public/main.js', 'javascripts/public/fallback.js']
```

## License

Assets-expander is released under the MIT license.
