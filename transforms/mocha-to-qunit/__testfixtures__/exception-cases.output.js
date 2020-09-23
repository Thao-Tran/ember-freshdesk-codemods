import { module, test } from 'qunit';
import {
  setupTest,
  setupWindowMock,
  setupApplicationTest
} from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import { run } from '@ember/runloop';
import {
  SWITCHER_OPTIONS as switcherOptions
} from 'freshdesk/constants/automations';

let name = faker.name.firstName();

module('Integration | Component test', function(hooks) {
  setupTest(hooks);

  switcherOptions();

  // ...
});

module('Integration | Component test', function(hooks) {
  let router, route, transitionTo;
  setupTest(hooks);

  // ...
});

module('Integration | Component', function(hooks) {
  setupApplicationTest(hooks);
  setupTest(hooks);
  setupWindowMock(hooks);

  module('Context test turns to module', function(hooks) {

    hooks.before(function() {
      // Testing for before
    });

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    test('Testing await done', async function(assert) {
      assert.false(false);
    });

    test('basic negative expect statements', async function(assert) {
      assert.false(false);
      assert.false(false, 'Message');
      assert.true(true);
      assert.true(true, 'Message');
      assert.notEqual(1, 2);
      await assert.notEqual(1, 2, 'Message');

      assert.notOk('Test', 'Message');
      assert.ok('Test', 'not empty assertion');

      // Variations in dom assertions
      await assert.dom('[data-test-id=page-title]').doesNotExist();

      return assert.dom('[data-test-id=page-title]').exists();
    });

    test('Method with return expression', function(assert) {
      run.later(() => {
        try {
          assert.true(scrollSpy.calledOnce);
        } catch(err) {}
      }, 100);

      return wait(() => {
        assert.dom('[data-test-id=page-title]').exists();
      });
    });
  });

  module('Context test turns to module', function(hooks) {

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    hooks.afterEach(function() {
      // Testing for afterEach without hooks attribute
    });

    hooks.after(function () {
      // Testing for after
    });

    test('Expect within a nested block', function(assert) {
      // Comment
      [true, true].forEach((key) => {
        // Inner Comment
        assert.true(key);
      });

      [true, true].forEach(function(item) {
        // Inner Comment
        assert.true(item);
      });
    });
  });
});
