'use strict'

const { runTransformTest } = require('codemod-cli')

runTransformTest({
  type: 'jscodeshift',
  name: 'modify-import'
})
