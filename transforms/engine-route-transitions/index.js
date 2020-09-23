const { getParser } = require('codemod-cli').jscodeshift

module.exports = function transformer (file, api) {
  const j = getParser(api)

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        property: { name: 'transitionTo' }
      }
    })
    .forEach(path => {
      if (['Literal', 'StringLiteral'].includes(path.value.arguments[0].type)) {
        const oldName = path.value.arguments[0].value
        const newName = oldName.replace(/helpdesk\.\w+\./, '')
        path.value.arguments[0].value = newName
      }
    })
    .toSource({ quote: 'single' })
}
