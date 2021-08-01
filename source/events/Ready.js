const Event = require('../structure/Event.js');

class ReadyEvent extends Event {
  constructor() {
    super({
      id: 'ReadyEvent',
      once: true,
    });
  }

  exec() {
    console.log(`${this.client.user.username} is now online!`);
  }
}

module.exports = ReadyEvent;