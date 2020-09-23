const { joinParams, extractExpect, constructDomExists, constructDomAssertions, findIdentifier } = require('./utils')

module.exports = [{
  name: 'expected-true-or-false',
  /* expect()
    .to.be.true,
    .to.be.false,
    .to.be.not.true,
    .to.be.not.false
  */
  matcher: function (expression, path, j) {
    return expression.property && ['true', 'false'].includes(expression.property.name)
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage,
      hasShouldNot
    } = extractExpect(path, j)

    var assertMethod = expression.property.name === 'true'
    if (hasShouldNot) {
      assertMethod = !assertMethod
    }

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`
  }
}, {
  name: 'expected-ok-or-empty-or-exists-or-present-or-undefined',
  /* expect()
    .to.be.ok,
    .to.be.not.ok,
    .to.be.empty,
    .to.be.not.empty,
    .to.be.exist,
    .to.not.be.exist,
    .to.be.present,
    .to.be.not.present,
    .to.be.undefined
  */
  matcher: function (expression) {
    return expression.property && ['ok', 'empty', 'exist', 'present', 'undefined', 'null', 'nil'].includes(expression.property.name)
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelectorWithoutProperty
    } = extractExpect(path, j)

    if (['empty', 'undefined', 'null', 'nil'].includes(expression.property.name)) {
      hasShouldNot = !hasShouldNot
    }

    const fallback = function () {
      var assertMethod = hasShouldNot ? 'notOk' : 'ok'
      return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`
    }

    try {
      if (hasSelectorWithoutProperty) {
        return constructDomExists(j, assertArgument, assertMessage, !hasShouldNot, undefined)
      } else {
        return fallback()
      }
    } catch {
      return fallback()
    }
  }
}, {
  name: 'expected-called',
  // expect(spy()).to.have.been.called;
  matcher: function (expression) {
    return (expression.property && expression.property.name === 'called')
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j)
    const selector = `${assertArgumentSource}.called`
    const assertArgs = joinParams(selector, assertMessage)
    return `assert.${!hasShouldNot}(${assertArgs});`
  }
}, {
  name: 'expected-match',
  /* expect(result)
       .to.be.match
       .to.not.match
    */
  matcher: function (expression, path, j) {
    const name = (expression.callee && expression.callee.property && expression.callee.property.name) || ''
    return name === 'match'
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j)
    var expectedArgument = j(expression.arguments).toSource()
    var assertMethod = hasShouldNot ? 'notOk' : 'ok'
    var assertArguments = joinParams(`${assertArgumentSource}.match(${expectedArgument})`, assertMessage)

    return `assert.${assertMethod}(${assertArguments});`
  }
}, {
  name: 'expected-closeto',
  /* expect(result)
       .to.be.closeTo
    */
  matcher: function (expression) {
    const name = (expression.callee && expression.callee.property && expression.callee.property.name) || ''
    return name === 'closeTo'
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage } = extractExpect(path, j)
    var [expectedArgument, delta] = expression.arguments
    var assertStatement = `${assertArgumentSource} >= ${expectedArgument.value - delta.value} && ${assertArgumentSource} <= ${expectedArgument.value + delta.value}`
    var assertArguments = joinParams(assertStatement, assertMessage)

    return `assert.true(${assertArguments});`
  }
}, {
  name: 'expected-equal',
  // expect(true)
  //  .to.equal(true);
  //  .to.equals(true);
  //  .to.eq(true);
  // expect(1).to.not.equal(2);
  // expect({key: value})
  //  .to.deep.equal({key: value});
  //  .to.eql({key: value});
  //  .to.not.deep.equal({key: someOthervalue});
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && ['equal', 'eql', 'eq', 'equals'].includes(expression.callee.property.name))
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, hasShouldNot, assertMessage } = extractExpect(path, j)
    var expectedArgument = j(expression.arguments).toSource()
    var assertMethod
    var hasDeepAssertion = findIdentifier(path, j, 'deep')

    if (expectedArgument === 'true' || expectedArgument === 'false') {
      assertMethod = hasShouldNot ? expectedArgument !== 'true' : expectedArgument === 'true'
      return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`
    }

    if (expression.callee.property.name === 'eql' || hasDeepAssertion) {
      assertMethod = hasShouldNot ? 'notDeepEqual' : 'deepEqual'
    } else {
      assertMethod = hasShouldNot ? 'notEqual' : 'equal'
    }

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`
  }
}, {
  name: 'expected-length',
  // expect(findAll('[data-test-id=page-title]')).to.have.length(1);
  matcher: function (expression) {
    return expression.callee && expression.callee.property && expression.callee.property.name.includes('length')
  },
  transformer: function (expression, path, j) {
    var { assertArgument, assertArgumentSource, assertMessage, hasSelectorWithoutProperty } = extractExpect(path, j)

    var lengthValue = j(expression.arguments[0]).toSource()

    try {
      if (hasSelectorWithoutProperty) {
        return constructDomExists(j, assertArgument, assertMessage, lengthValue !== '0', lengthValue)
      } else {
        return `assert.equal(${joinParams(`${assertArgumentSource}.length`, lengthValue, assertMessage)});`
      }
    } catch {
      return `assert.equal(${joinParams(`${assertArgumentSource}.length`, lengthValue, assertMessage)});`
    }
  }
}, {
  name: 'expected-contains-or-includes-or-string',
  /* expect(result)
     .to.be.contains,
     .to.contain,
     .to.be.oneOf,
     .to.not.be.oneOf,
     .to.have.contain,
     .to.be.contain,
     .to.contains,
     .to.not.contain,
     .to.not.contains,
     .to.includes,
     .to.not.includes,
     .to.include,
     .to.not.include,
     .to.have.string,
     .to.not.have.string
  */
  matcher: function (expression) {
    var name = (expression.callee && expression.callee.property && expression.callee.property.name) || ''
    return ['contain', 'contains', 'include', 'includes', 'string', 'oneOf'].includes(name)
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j)
    var expectedArgument = j(expression.arguments).toSource()

    var assertMethod = !hasShouldNot
    var assertArguments = (expression.callee.property.name === 'oneOf')
      ? joinParams(`${expectedArgument}.includes(${assertArgumentSource})`, assertMessage)
      : joinParams(`${assertArgumentSource}.includes(${expectedArgument})`, assertMessage)

    return `assert.${assertMethod}(${assertArguments});`
  }
}, {
  name: 'expected-lt-lte-below-gt-gte-above',
  /* expect()
    .to.be.lt,
    .to.be.lte,
    .to.be.below,
    .to.be.gt,
    .to.be.gte,
    .to.be.above
  */
  matcher: function (expression) {
    return expression.callee && expression.callee.property && ['lt', 'below', 'lte', 'gt', 'above', 'gte', 'least', 'most'].includes(expression.callee.property.name)
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage
    } = extractExpect(path, j)
    var expectedArgument = j(expression.arguments).toSource()
    let comparisonSymbol

    switch (expression.callee.property.name) {
      case 'lt':
      case 'below':
        comparisonSymbol = '<'
        break
      case 'gt':
      case 'above':
        comparisonSymbol = '>'
        break
      case 'lte':
      case 'most':
        comparisonSymbol = '<='
        break
      case 'gte':
      case 'least':
        comparisonSymbol = '>='
        break
    }

    return `assert.true(${joinParams(`${assertArgumentSource} ${comparisonSymbol} ${expectedArgument}`, assertMessage)})`
  }
}, {
  name: 'expected-dom-specific-assertions',
  // expect(find('[data-test-id=page-title]')).to.have.attr('href', 'link');
  // expect(find('[data-test-id=page-title]')).to.have.attribute('aria-label', 'label');
  // expect(find('[data-test-id=page-title]')).to.not.have.attr('disabled');
  // expect(find('[data-test-id=page-title]')).to.have.class('text--bold');
  // expect(find('[data-test-id=page-title]')).to.have.text('input');
  // expect(find('[data-test-id=page-title]')).to.have.value('input');
  // expect(find('[data-test-id=page-title]')).to.be.visible;
  // expect(find('[data-test-id=page-title]')).to.be.disabled;
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && ['attr', 'attribute', 'class', 'text', 'value', 'prop'].includes(expression.callee.property.name)) ||
      (expression.property && ['visible', 'disabled', 'enabled'].includes(expression.property.name))
  },
  transformer: function (expression, path, j) {
    var {
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelector,
      hasSelectorWithoutProperty
    } = extractExpect(path, j)

    var property = expression.property || expression.callee.property
    var assertType = property.name

    var expectedArguments = expression.arguments

    if (hasSelectorWithoutProperty || !hasSelector) {
      return constructDomAssertions(j, assertArgument, assertMessage, assertType, hasShouldNot, expectedArguments)
    } else {
      // NOTE This is a rare case where they have implemented chaining and then used attr or class for assertion,
      // For these cases we need to find a solution if present else do it manually
      return j(expression).toSource()
    }
  }
}, {
  name: 'expected-a-an',
  // expect().to.be.a;
  // expect().to.be.an;
  // expect().to.be.instanceOf;
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && ['a', 'an', 'instanceof'].includes(expression.callee.property.name))
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage
    } = extractExpect(path, j)
    let expectedArgument = expression.arguments[0].value || expression.arguments[0].name.toLowerCase()

    switch (expectedArgument) {
      case 'array':
        expectedArgument = 'Array'
        break
      case 'date':
        expectedArgument = 'Date'
        break
      case 'blob':
        expectedArgument = 'Blob'
        break
      case 'file':
        expectedArgument = 'File'
        break
      case 'object':
        expectedArgument = 'Object'
        break
    }

    return `assert.true(${joinParams(`${assertArgumentSource} instanceof ${expectedArgument} || typeof ${assertArgumentSource} === '${expectedArgument}'`, assertMessage)});`
  }
}, {
  name: 'expected-keys',
  // expect(true).to.include.all.keys(true);
  // expect(true).to.have.keys(true);
  // expect(true).to.have.property(true);
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && ['keys', 'property', 'members'].includes(expression.callee.property.name))
  },
  transformer: function (expression, path, j) {
    const { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j)
    const expectedArgument = (expression.callee.property.name === 'members') ? j(expression.arguments).toSource() : `[${j(expression.arguments).toSource()}]`
    return `assert.${!hasShouldNot}(${joinParams(`${expectedArgument}.every(x => ${assertArgumentSource}.includes(x))`, assertMessage)});`
  }
}, {
  name: 'expected-throws',
  // expect(function).to.throw(error);
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && expression.callee.property.name === 'throw')
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j)
    var expectedArgument = j(expression.arguments).toSource()
    const assertMethod = (hasShouldNot) ? 'ok' : 'throws'
    const assertArgs = (hasShouldNot) ? joinParams(assertArgumentSource, assertMessage) : joinParams(assertArgumentSource, expectedArgument, assertMessage)
    return `assert.${assertMethod}(${assertArgs});`
  }
}, {
  name: 'expected-calledWith',
  // expect().to.be.calledWith;
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && expression.callee.property.name === 'calledWith')
  },
  transformer: function (expression, path, j) {
    const { assertArgumentSource } = extractExpect(path, j)

    return `assert.true(${assertArgumentSource}.calledWith(${joinParams(j(expression.arguments).toSource())}));`
  }
}, {
  name: 'expected-callCount',
  // expect().to.have.callCount;
  matcher: function (expression) {
    return (expression.callee && expression.callee.property && expression.callee.property.name === 'callCount')
  },
  transformer: function (expression, path, j) {
    const { assertArgumentSource } = extractExpect(path, j)

    return `assert.equal(${assertArgumentSource}.callCount, ${joinParams(j(expression.arguments).toSource())});`
  }
}
]
