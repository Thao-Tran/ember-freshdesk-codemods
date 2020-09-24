# @freshworks/ember-codemods

![npm (scoped)](https://img.shields.io/npm/v/@freshworks/ember-codemods)
![](https://github.com/freshdesk/ember-freshdesk-codemods/workflows/Node%20CI/badge.svg)


A collection of codemods by Freshworks forked by me. There were some issues with the `mocha-to-qunit` codemod that were annoying to fix manually after applying the codemod, so I fixed the issues myself.

## Installation
Clone this repo and install jscodeshift globally.
```
git clone https://github.com/Thao-Tran/ember-freshdesk-codemods.git
npm i -g jscodeshift
```

## Usage

To run a specific codemod from this project, you would run the following:

```
jscodeshift -t <path-to-repo>/transforms/<transform-name>/index.js <path-to-directory-or-file-to-transform>
```

## Transforms

<!--TRANSFORMS_START-->
* [async-leaks](transforms/async-leaks/README.md)
* [cleanup-imports](transforms/cleanup-imports/README.md)
* [engine-route-transitions](transforms/engine-route-transitions/README.md)
* [insert-hooks](transforms/insert-hooks/README.md)
* [mocha-to-qunit](transforms/mocha-to-qunit/README.md)
* [modify-import](transforms/modify-import/README.md)
* [remove-unused-get-import](transforms/remove-unused-get-import/README.md)
* [setup-helpers-with-await](transforms/setup-helpers-with-await/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`
