var settings = require('../settings.json');
exports.run = (client, msg, args, db, util) => {
  const Discord = require('discord.js');
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setAuthor(msg.author.username, `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png?size=128`)
    .setTitle("Confirm Help.")
    .setDescription("**" + settings.prefix + "help** =~= Displays this help message.\n**" + settings.prefix + "confirm new <password>** =~= Sets a password on the channel, so new users have to type it to get in.\n**" + settings.prefix + "confirm update <NewPass>** =~= Updates your old password/channel with a new one.\n**" + settings.prefix + "confirm show** =~= Shows the channel and password linked to your server.\n**" + settings.prefix + "confirm delete** =~= Deletes your server from the database removing everything set by the bot.\n" + settings.prefix + "info** =~= shows info about the bot.\n**" + settings.prefix + "suggest <suggestion>** =~= Suggest improvements for my bot, which are displayed in the support server.\`\`\`For more info about these commands, visit: https://pastebin.com/Jz4TTGrd\`\`\`")
    .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=128`)
  msg.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['Help'],
};

exports.help = {
  name: 'help',
  description: 'Displays all commands.',
  usage: 'help',
};
