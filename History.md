[1.0.2 / 2014-02-27](https://github.com/jakubpawlowicz/assets-expander/compare/v1.0.1...v1.0.2)
==================

* Version bump due to a broken publishing of 1.0.1 at npm registry.

[1.0.1 / 2014-02-27](https://github.com/jakubpawlowicz/assets-expander/compare/v1.0.0...v1.0.1)
==================

* Fixes incorrectly declared js-yaml dependency

[1.0.0 / 2014-02-25](https://github.com/jakubpawlowicz/assets-expander/compare/v0.5.0...v1.0.0)
==================

* Drops node 0.6 support in favour to node 0.10.
* Drops our private build of yaml.js in favour to js-yaml.
* Removes Makefile and test.bat and adds cross-platform test runner via `npm test`.
* Fixes code formatting following JSHint guidelines. Adds `npm run check`.
* Adds code formatting checks on prepublish step.

0.5.0 / 2012-09-06
==================

* Added ability to override stylesheets/javascripts directories via 'path' option to #processGroup method.

0.4.1 / 2012-08-07
==================

* Fixed Yaml comments parsing on Windows.

0.4.0 / 2012-08-06
==================

* Added full windows support with tests.
* Patched yaml.js to support CRLF line endings.

0.3.1 / 2012-08-02
==================

* Added direct path to vows dependency.
* Added fs.existsSync fallback to get rid of 0.8 warnings.

0.3.0 / 2012-07-09
==================

* Removed 'rightjs' dependency as it's an overkill to use it.

0.2.3 / 2012-06-17
==================

* Fixed error classes (missing name which affects instanceof).

0.2.2 / 2012-06-17
==================

* Fixed tests (no assert.length).
* Added exceptions in case of unknown group/type or YAML syntax.
* Fixed dev dependencies.

0.2.1 / 2011-04-15
==================

* Fixes expanding folder/prefix* wildcard paths.

0.2.0 / 2011-04-07
==================

* **type** property (denoting file extension, e.g. 'css') is now passed to processGroup method allowing reuse of single AssetsExpander instance for finding various types of files.

0.1.2 / 2011-04-05
==================

* Fixed repeating entries when processing groups.
* Fixed processing wildcard attributes with extra characters, e.g. 'abstract-*'.
* Fixed parsing lists elements.

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
