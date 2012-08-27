[![build status](https://secure.travis-ci.org/GoalSmashers/assets-expander.png)](http://travis-ci.org/GoalSmashers/assets-expander)
## What is assets-expander? ##

assets-expander is a node.js library for expanding list(s) of files defined in YAML file into a flat list(s) of files.

## Usage ##

### How to install assets-expander? ###

    npm install assets-expander

### How to user assets-expander? ###

    var AssetsExpander = require('assets-expander');
    var expander = new AssetsExpander('assets.yml', { root: 'path/to/public/dir' });
    expander.processGroup('stylesheets', 'public') // gets a flat list of assets in public group
    
### How to define assets.yml file? ###

It depends what files you want to have in *public* group, but in general the file should look something like this.

    stylesheets:
      public:
        - 'reset,shared,base,home'
        
Then if you have the following directory structure:

    stylesheets
      - reset.css
      - shared.css
      - base.css
      - home.css
      
executing the code above will get you a list of full paths to these 4 files:

    ['.../stylesheets/reset.css', '.../stylesheets/shared.css', '.../stylesheets/base.css', '.../stylesheets/home.css']
    
## License ##

Assets-expander is released under the MIT license.