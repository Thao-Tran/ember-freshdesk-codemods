import { run } from '@ember/runloop';
import { describe, it } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    this.get('store').createRecord('contact', contact);
    this.get('store').createRecord('ticket', ticket);
  });

  it('should add run loop', async function() {
    get(this, 'store').findAll('tickets');
    server.createList('email-config', 20);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    get(this, 'store').pushPayload('contact', { contact: agentContact.attrs  });
    get(this, 'store').pushPayload('contact', { contact: userContact.attrs  });
  });

  it('should ignore existing run loop', async function() {
    server.createList('email-config', 101);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    await run(() => {
      this.get('store').pushPayload('agent', agents);
    });
  });

});
