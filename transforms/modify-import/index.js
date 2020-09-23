const { getParser } = require('codemod-cli').jscodeshift
const beautifyImports = require('../beautify-imports')
const { cleanupBlankImports } = require('../cleanup-imports')
const mapper = require('./mapper')

module.exports = function transformer (file, api) {
  let source = file.source
  const j = getParser(api)
  const root = j(file.source)
  const newImportPath = '@freshdesk/test-helpers'
  const lineTerminator = source.indexOf('\r\n') > -1 ? '\r\n' : '\n'

  mapper.forEach((map) =>
    map.importSpecifiers.sort().forEach(
      (importSpecifiers) => transformImport(
        root,
        importSpecifiers,
        map.importDeclaration,
        map.importType
      )
    )
  )

  cleanupBlankImports(j, root)

  source = beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  )

  return source

  // Check if there any importSpecifier with the given name
  function findImportSpecifier (root, importName, oldImportPath, type = 'specifier') {
    const isDefault = (type === 'default')
    const importType = isDefault ? j.ImportDefaultSpecifier : j.ImportSpecifier
    return root.find(importType, {
      local: {
        name: importName
      }
    }).filter((path) => {
      return (path.parent.value.source.value === oldImportPath)
    })
  };

  function findImportDeclaration (root, declarationName) {
    return root.find(j.ImportDeclaration, {
      source: {
        value: declarationName
      }
    })
  };

  function createOrImportDeclaration (root, declarationName) {
    const existingDeclaration = findImportDeclaration(root, declarationName)

    if (existingDeclaration.length !== 0) {
      return existingDeclaration.get().value
    } else {
      const allImports = root.find(j.ImportDeclaration)
      const lastImport = allImports.at(allImports.length - 1)
      const newImport = j.importDeclaration([], j.literal(declarationName))
      lastImport.insertAfter(newImport)
      return newImport
    }
  };

  function insertNewSpecifier (importDeclaration, specifierName) {
    const newSpecifier = j.importSpecifier(j.identifier(specifierName))
    importDeclaration.specifiers.push(newSpecifier)
  };

  function transformImport (root, specifierName, existingImportPath, importType = 'specifier') {
    const oldImportMethod = findImportSpecifier(root, specifierName, existingImportPath, importType)

    // Remove the import specifier from the old format if present
    oldImportMethod.remove()

    if (oldImportMethod.length !== 0) {
      const importDeclaration = createOrImportDeclaration(root, newImportPath)
      insertNewSpecifier(importDeclaration, specifierName)
    }
  };
}
