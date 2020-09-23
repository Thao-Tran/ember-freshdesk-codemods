import { module, test } from 'qunit';
import { find, findAll } from '@ember/test-helpers';
import {
  setupTest,
  setupWindowMock,
  setupApplicationTest
} from '@freshdesk/test-helpers';

module('Integration | Component', function(hooks) {
  setupApplicationTest(hooks);
  setupTest(hooks);
  setupWindowMock(hooks);

  test('basic expect statements', async function(assert) {
    // Simple true validation
    assert.true(true);
    assert.true(true, 'expect with message');
    assert.ok('Test');
    assert.ok('Test', 'With message');
    assert.ok('Test');
    assert.ok('Test', 'With message');

    // Simple false validation
    assert.false(false);
    assert.false(false, 'expect with message');

    // Negative cases with variance
    assert.notOk(result);
    assert.notOk(result, 'With Message');
    assert.notOk(undefined);

    // Variations in equal assertion
    assert.true(true);
    assert.true(true);
    assert.true(true);
    assert.equal(find('[data-test-id=page-title]').innerText.trim(), '[Expected] Page Title', '[Message] Expression with message');
    assert.equal(window.location.pathname, '/support/login');
    assert.deepEqual({key: value}, {key: value});
    assert.deepEqual({key: value}, {key: value}, 'Assertion Message');
    assert.deepEqual({key: value}, {key: value});
    assert.notDeepEqual({key: value}, {key: some_other_value});

    // Variations in length
    // Find out if its a dom present case or not present case
    assert.dom('[data-test-id=page-title]').exists({ count: 2 }, '[Message] Multiple elements should be present');
    assert.dom('[data-test-id=page-title]').exists({ count: 1 });
    assert.dom('[data-test-id=page-title]').exists({ count: 1 });
    assert.dom('[data-test-id=page-title]').exists({ count: 1 }, '[Message] One Element Present'); // With message and length 1
    assert.dom('[data-test-id=page-title]').doesNotExist('[Message] Element not present');
    assert.dom('[data-test-id=page-title]').doesNotExist(); // Without message
    assert.dom('[data-test-id=page-title]').exists({ count: titles.length }, '[Message] Length Comparison with variable value');
    assert.dom('[data-test-id=page-title]').exists({ count: titlesLength });

    assert.equal(pageTitleSelector.length, 2, 'Assertion Message');
    assert.equal(pageTitleSelector.length, titlesLength, 'Assertion Message');
    assert.equal(pageTitleSelector.length, titlesLength);
    assert.equal(find('[data-test-id=page-titles]').querySelectorAll('[data-test-id=page-title]').length, 2);
    assert.equal(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]').length, 1);

    // Variations in dom assertions
    assert.dom('[data-test-id=page-title]').exists();
    assert.dom('[data-test-id=page-title]').doesNotExist();
    assert.true(find('[data-test-id=page-title]').getAttribute('href').includes('/some/url'));
    assert.true(find('[data-test-id=page-title]').className.includes('active'));
    assert.ok(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]'));
  });

  // 'dom-specific-assertions'
  test('expects various dom specific assertions', function(assert) {
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
    assert.dom('[data-test-id=page-title]').hasAttribute('aria-label', 'label', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasAttribute('disabled');
    assert.dom('[data-test-id=page-title]').hasClass('text--bold');
    assert.dom(findAll('[data-test-id=page-title]')[1]).hasClass('text--bold');

    assert.dom('[data-test-id=page-title]').isDisabled();
    assert.dom('[data-test-id=page-title]').isVisible('Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasValue('input');
    assert.dom(pageTitleSelector).hasAttribute('href', 'link');
    assert.dom(prev_button).hasAttribute('disabled', 'Validating Previous button');
    assert.dom(pageTitleSelector).isDisabled();
    assert.dom(pageTitleSelector).hasText(inputVariable, 'Assertion Message');

    assert.dom('[data-test-id=page-title]').doesNotHaveAttribute('disabled', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').isNotDisabled();
    assert.dom('[data-test-id=page-title]').isNotVisible();
    assert.dom(updateButton).isNotDisabled();
  });

  // 'expected-contains'
  test('Contains expects expected-contains', function(assert) {
    assert.true('Message has input'.includes('input'));
    assert.true([1, 2].includes(2));
    assert.true('Message has input'.includes('input'), 'Assertions Message');
    assert.true('Message has input'.includes('input'));
    assert.true('Message has input'.includes('input'));

    assert.true('Message has input'.includes('input'));
    assert.true('Message has input'.includes('input'));
    assert.true([1, 2].includes(2));
    assert.true([1, 2].includes(2));
    assert.true('Message has input'.includes('input'));
    assert.true(['name', 'customFields.custom_company_text_field'].includes(i.name));
    // Should handle this edge cases
    // expect(options).to.be.an('array').to.not.include(serviceTaskType);
    // Not contains
    assert.false('Message'.includes('input'));
    assert.false('Message'.includes('input'), 'Assertions Message');
    assert.false('Message'.includes('input'));
    assert.false('Message'.includes('input'), 'Assertions Message');
    assert.false('Message'.includes('input'));
  });

  // expected-closeto
  test('Contains expects expected-match', function(assert) {
    assert.true(165 >= 165 && 165 <= 171, 'check whether the given number exists within the provided delta');
    assert.true(2.5 >= 1.5 && 2.5 <= 2.5);
  });

  // expected-match
  test('Contains expects expected-match', function(assert) {
    assert.ok('Message-1234-message'.match(/[a-zA-Z]+-\d+-[a-zA-Z]/), 'String should match the regex');
    assert.notOk('1234-message'.match(/[a-zA-Z]+-\d+-[a-zA-Z]/), 'String should not match the regex');
  });

  // 'expected-null'
  test('Contains expects expected-null', function(assert) {
    assert.ok('Has Value', 'message');
    assert.notOk(['Has Value'], 'message');

    // or assert.dom('selector').doesNotExist(message);
    assert.dom('dom-selector').exists('message');
    assert.dom('dom-selector').doesNotExist('message');
    assert.ok(domSelector, 'message');
    assert.notOk(domSelector, 'message');
    assert.notOk(subject.get('ticket.customFields.nested_field_item'));
  });

  // 'expected-exists'
  test('Contains expects expected-exists', function(assert) {
    let refrence = 'Some Value';
    assert.ok('Value');
    assert.ok(['Has Value'], 'message');
    assert.ok(refrence, 'message');
    assert.notOk(refrence, 'message');

    // or assert.dom('selector').doesNotExist(message);
    assert.dom('dom-selector').exists();
    assert.dom('dom-selector').exists('message');
    assert.dom('dom-selector').doesNotExist('message');
    assert.ok(findAll('dom-selector')[0]);
    assert.notOk(findAll('dom-selector')[0]);
    assert.ok(domSelector);
    assert.notOk(domSelector, 'message');
  });

  // compare assertions
  test('Contains expects lt, lte, below, gt, gte, above', function(assert) {
    assert.true(1 < 2);
    assert.true(2 < 3, 'assert message');
    assert.true(2 <= 2);

    assert.true(1 > 2);
    assert.true(2 > 3, 'assert message');
    assert.true(2 >= 2);
    assert.true(findAll('.ember-power-select-option').length >= 1);
  });

  // type check
  test('Contains expects a, an', function(assert) {
    assert.true([1,2,3] instanceof Array || typeof [1,2,3] === 'Array');
    assert.true({x: 1} instanceof Object || typeof {x: 1} === 'Object');
    let currentDateVar = new Date();
    assert.true(currentDateVar instanceof Date || typeof currentDateVar === 'Date');
    assert.true([1, 2] instanceof Array || typeof [1, 2] === 'Array');
    assert.true(blob instanceof Blob || typeof blob === 'Blob');
    assert.true(file instanceof File || typeof file === 'File');
  });

  // DeepIncludes
  test('Contains expects keys, property', function(assert) {
    assert.true(['content','products'].every(x => model.includes(x)));
    assert.true([2,3].every(x => elementResize(2560, 1600).includes(x)));
    assert.true(['emailToDisplay'].every(x => route.controller.includes(x)));
    assert.false(['custom_fields'].every(x => requestParams[0].includes(x)), 'some message');
    assert.true(fackDomains.every(x => this.get('data.company.domains').includes(x)));
  });

  // Throws
  test('Contains expects throw', function(assert) {
    assert.throws(result);
    assert.throws(result, customError);
    assert.ok(fn1);
  });

  // Called
  test('Contains expects called', function(assert) {
    assert.true(sinon.spy().called, 'Assertion Message');
    assert.true(resultSpy.called);
    assert.true(sinon.spy(component.get('marketplace').trigger('click_ticket')).called);
    assert.true(component.resultSpy.called);
    assert.true(route.flashMessages.danger.called);
    assert.true(get(telephony, 'marketplace').publishEvent.called);

    assert.false(sinon.spy().called);
  });
});
