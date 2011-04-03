0.1.1 / 2011-04-03
==================

  * Added support for dashes (-) in YAML files.

0.1.0 / 2011-03-26
==================

  * First version of assets-expander library.
  * Implemented assets expanding from YAML files.
  * Implemented expanding:
    * simple list - 'asset1,asset2,asset3'
    * wildcard flat lists - 'asset*'
    * wildcard multi-level lists - '\*\*/\*'
    * single level sublists - 'folder/[asset1,asset2,asset3]'