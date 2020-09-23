const { getParser } = require('codemod-cli').jscodeshift
const { cleanupImports } = require('../cleanup-imports')
const beautifyImports = require('../beautify-imports')

module.exports = function transformer (file, api) {
  const j = getParser(api)
  const root = j(file.source)
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n'

  cleanupImports(j, root)

  return beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  )
}
