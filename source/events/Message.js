const Event = require('../structure/Event.js');
const { Collection, MessageEmbed } = require('discord.js');
const clr = require('../config/colors');
const emj = require('../config/emoji');


class MessageEvent extends Event {
  constructor() {
    super({
      id: 'message',
      once: false,
    });
  }

  async exec(message) {
    const prefix = await this.client.prefix(message);
    const defaultPrefix = require('.././config/secret').prefix;
    if (message.mentions.has(this.client.user.id) && !message.mentions.has("@everyone") && !message.mentions.has("@here")) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(clr.main)
          .setDescription(`🎊 | ${this.client.user.username}'s default prefix is \`${defaultPrefix}\` \nAnd ${this.client.user.username}'s prefix in ${message.guild.name} is \`${prefix}\``)
      );

    }
    if (message.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (commandName.length === 0) return;
    const command = this.client.commands.get(commandName)
      || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command) {
      const guildEmbed = new MessageEmbed()
      .setColor(clr.error)
      .setDescription(`${emj.cross} | This command can only be used in guilds.`)
      const ownerEmbed = new MessageEmbed()
      .setColor(clr.error)
      .setDescription(`${emj.cross} | This command can only be used by the developers of this bot.`)
      const argsEmbed = new MessageEmbed()
      .setColor(clr.error)
      .setDescription(`${emj.cross} | That is not a valid usage of this command check out \`${prefix}help ${command.id}\` for more info!`)

      if (command.guildOnly && !message.guild) {
      return message.inlineReply({ embed: guildEmbed, allowedMentions: { repliedUser: false }});
      }
      else if (command.ownerOnly && !this.client.owners.includes(message.author.id)) {
        return message.inlineReply({embed: ownerEmbed, allowedMentions: { repliedUser: false }});
      }
      else if (command.requiredArgs && args.length < command.requiredArgs) {
        return message.inlineReply({embed: argsEmbed,  allowedMentions: { repliedUser: false }});
      }
      const userPermissions = command.userPermissions;
      const clientPermissions = command.clientPermissions;
      const missingPermissions = [];
      if (userPermissions.length) {
        for (let i = 0; i < userPermissions.length; i++) {
          const hasPermission = message.member.hasPermission(userPermissions[i]);
          if (!hasPermission) {
            missingPermissions.push(userPermissions[i]);
          }
        }
        if (missingPermissions.length) {
          let userPermsMissing = new MessageEmbed()
          .setColor(clr.error)
          .setDescription(`${emj.cross} | You're missing these required permissions:\n\`${missingPermissions.join('\n')}\``)
          return message.inlineReply({
embed: userPermsMissing,
allowedMentions: { repliedUser: true }
});
        }
      }
      if (clientPermissions.length) {
        for (let i = 0; i < clientPermissions.length; i++) {
          const hasPermission = message.guild.me.hasPermission(clientPermissions[i]);
          if (!hasPermission) {
            missingPermissions.push(clientPermissions[i]);
          }
        }
        if (missingPermissions.length) {
          let clientPermsMissing = new MessageEmbed()
          .setColor(clr.error)
          .setDescription(`${emj.cross} | I'm missing these required permissions:\n\`${missingPermissions.join('\n')}\``);
          return message.inlineReply({
embed: clientPermsMissing,
allowedMentions: { repliedUser: false }
});
        }
      }
      if (!this.client.cooldowns.has(command.name)) {
        this.client.cooldowns.set(command.name, new Collection());
      }
      const now = Date.now();
      const timestamps = this.client.cooldowns.get(command.name);
      const cooldownAmount = command.cooldown * 1000;
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
          return message.channel.send(`${emj.cross} | Please wait ${timeLeft} more second(s) before reusing the \`${command.id}\` command.`);
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
      command.exec(message, args);
    }
    catch (error) {
      console.log(error);
    }
  }
}

module.exports = MessageEvent;