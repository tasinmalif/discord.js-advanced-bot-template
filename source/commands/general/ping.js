const Command = require('../../structure/Command.js');
const clr = require('../../config/colors');
const emj = require('../../config/emoji');
class pingCommand extends Command {
  constructor() {
    super({
      id: 'ping',
      aliases: ['pong'],
      category: 'general',
      usage: '',
      guildOnly: true,
      ownerOnly: false,
      requiredArgs: 0,
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
      cooldown: 3,
      description: 'Replies pong!',
    });
  }
exec(message) {
    message.inlineReply("pong!", { allowedMentions: { repliedUser: false } });
  }
}
module.exports = pingCommand;