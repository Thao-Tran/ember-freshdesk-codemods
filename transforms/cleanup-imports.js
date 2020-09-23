function removeUnusedImportSpecifiers (j, root) {
  root.find(j.ImportSpecifier)
    .filter((path) => {
      const importName = (path.node.local || path.node.imported).name
      const identifierPresent = root.find(j.Identifier, {
        name: importName
      })
        .filter((path) => {
          return (path.name !== 'local' && path.name !== 'imported')
        })

      return (identifierPresent.length === 0)
    }).remove()
}

function cleanupBlankImports (j, root) {
  root.find(j.ImportDeclaration)
    .filter((path) => (path.get().value.specifiers.length === 0))
    .remove()
}

function removeDuplicateImports (j, root) {
  const existingList = []
  root.find(j.ImportSpecifier)
    .filter((path) => {
      const name = path.node.imported.name
      if (!existingList.includes(name)) {
        existingList.push(path.node.imported.name)
        return false
      } else {
        // Captured as duplicate import
        return true
      }
    }).remove()
}

function setupHooksForTest (setupTestTypes, j, root) {
  setupTestTypes.forEach(function (name) {
    root.find(j.FunctionExpression)
      .filter((path) => j(path).find(j.Identifier, { name }).length !== 0)
      .forEach((path) => transformHooks(path, name, j, root))
  })
}

function setupCallbackHooks (hooks, name, j, root) {
  hooks.reduce(
    (paths, name) => paths.concat(root.find(j.Identifier, { name }).paths()),
    []
  ).forEach((path) => {
    j(path).closest(j.ExpressionStatement)
      .forEach((callback) => {
        callback.node.expression.callee.name = `hooks.${callback.node.expression.callee.name}`
      })
    j(path).closest(j.CallExpression, { callee: { name } })
      .forEach((module) => {
        module.node.arguments[1].params = ['hooks']
      })
  })
}

function transformHooks (path, name, j, root) {
  path.node.params = ['hooks']

  const hasHooks = j(path).find(j.VariableDeclaration)
    .filter((path) => j(path).find(j.Identifier, { name }).length !== 0)

  const hasHooksAssignment = j(path).find(j.AssignmentExpression)
    .filter((path) => j(path).find(j.Identifier, { name }).length !== 0)

  if (hasHooks.length > 0) {
    hasHooks.replaceWith((path) => `${name}(hooks);`)
  } else if (hasHooksAssignment.length > 0) {
    hasHooksAssignment.replaceWith((path) => `${name}(hooks)`)

    j(path).find(j.VariableDeclarator, { id: { name: 'hooks' } })
      .remove()
  } else {
    j(path).find(j.Identifier, { name })
      .closest(j.Expression)
      .replaceWith((path) => `${name}(hooks)`)
  }
}

function cleanupImports (j, root) {
  removeUnusedImportSpecifiers(j, root)
  cleanupBlankImports(j, root)
  removeDuplicateImports(j, root)
}

module.exports = {
  cleanupImports,
  cleanupBlankImports,
  removeUnusedImportSpecifiers,
  removeDuplicateImports,
  setupHooksForTest,
  setupCallbackHooks
}
