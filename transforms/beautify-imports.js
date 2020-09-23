module.exports = function beautifyImports (source) {
  return source.replace(/\bimport.+from/g, (importStatement) => {
    const openCurly = importStatement.indexOf('{')

    // leave default only imports alone
    if (openCurly === -1) {
      return importStatement
    }

    if (importStatement.length > 50) {
      // if the segment is > 50 chars make it multi-line
      const result = importStatement.slice(0, openCurly + 1)
      const named = importStatement
        .slice(openCurly + 1, -6).split(',')
        .map(name => `\n  ${name.trim()}`)

      return result + named.join(',') + '\n} from'
    } else {
      // if the segment is < 50 chars just make sure it has proper spacing
      return importStatement
        .replace(/,\s*/g, ', ') // ensure there is a space after commas
        .replace(/\{\s*/, '{ ')
        .replace(/\s*\}/, ' }')
    }
  })
}
