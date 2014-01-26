[![build status](https://secure.travis-ci.org/GoalSmashers/assets-expander.png)](http://travis-ci.org/GoalSmashers/assets-expander)
## What is assets-expander? ##

Assets-expander is a node.js library that turns a glob-like declarations from YAML file into a list of files.
Just see below for examples.

## Usage ##

### How to install assets-expander? ###

    npm install assets-expander

### How to user assets-expander? ###

    var AssetsExpander = require('assets-expander');
    var expander = new AssetsExpander('assets.yml', { root: 'path/to/public/dir' });
    expander.processGroup('javascripts', 'public') // gets a flat list of assets in public group

### How to define assets.yml file? ###

Just go with something like:

    javascripts:
      public:
        vendor: 'undescore,modernizr'
        public: '**/*'
    stylesheets:
      public:
        - 'reset,shared,base,home'

Then if you have the following directory structure:
    
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

then running the following code will give you the files you need:

    > expander.processGroup('stylesheets', 'public')
    > ['stylesheets/reset.css', 'stylesheets/shared.css', 'stylesheets/base.css', 'stylesheets/home.css']

    > expander.processGroup('javascripts', 'public')
    > ['javascripts/vendor/underscore.js', 'javascripts/vendor/modernizr.js', 'javascripts/public/main.js', 'javascripts/public/fallback.js']

## License ##

Assets-expander is released under the MIT license.
