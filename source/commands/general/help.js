const Command = require('../../structure/Command.js');
const { MessageEmbed } = require('discord.js');
const clr = require('../../config/colors');

class helpCommand extends Command {
  constructor() {
    super({
        id: 'help',
        aliases: ['cmd'],
        category: 'general',
        usage: '[command]',
        guildOnly: false,
        ownerOnly: false,
        requiredArgs: 0,
        userPermissions: ['SEND_MESSAGES'],
        clientPermissions: ['SEND_MESSAGES'],
        cooldown: 3,
        description: 'Shows command information of the bot.',
    });
  }

  async exec(message, args) {
    const prefix = await this.client.prefix(message);
    const embed = new MessageEmbed().setColor(clr.main)
    const command = this.client.commands.get(args[0]) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
    if(command) {
 embed.addFields(
   {name: 'NAME', value: `\`${command.id}\``, inline: true},
   {name: 'ALIASES', value: `\`${command.aliases.length ? command.aliases.join(', ') : 'None'}\``, inline: true},
   {name:'CATEGORY', value: `\`${command.category.toLowerCase() || 'Not Specified'}\``, inline: true},
   {name: 'COMMAND TYPE', value: `**Guild Only:** \`${command.guildOnly ? command.guildOnly : 'false'}\`\n**Owner Only:** \`${command.ownerOnly ? command.ownerOnly : 'false'}\``, inline: true},
   {name: 'COOLDOWN', value: `\`${command.cooldown ? command.cooldown : '0'} Second(s)\``, inline: true},
   {name: 'USAGE', value: command.usage ? `\`${prefix}${command.id}\` \`${command.usage}\`` : `\`${prefix}${command.id}\``},

   {name: 'USER PERMS', value: `\`${command.userPermissions.length ? command.userPermissions.join('\n') : 'Not Provided'}\``, inline: true},
   {name: 'BOT PERMS', value: `\`${command.clientPermissions.length ? command.clientPermissions.join('\n') : 'Not Provided'}\``, inline: true}

 )
 .setAuthor(`${command.id.toUpperCase()} INFO`, 'https://cdn.discordapp.com/emojis/804321066860150784.png?v=1').setDescription(command.description ? command.description : 'This Command doesn\'t have a description.')
    }
    else {
      embed.setDescription(`To get more info about a command use \`${prefix}help\` \`{command}\``)
      const categories = this.removeDuplicates(this.client.commands.map(command => command.category));
      for(const category of categories) {
      const categoryID = category.toUpperCase() || 'Undefined';
      embed.addField(categoryID, this.client.commands.filter(cmd => cmd.category === category).map(cmd => '`' + ccmd.id + '`').join(' '));
      }
    }
    message.channel.send(embed);
  }
  removeDuplicates(arr) {
  return [...new Set(arr)];
  }
}

module.exports = helpCommand;