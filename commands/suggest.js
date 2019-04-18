const date = require('dateformat');
const Discord = require('discord.js');
let id;
const settings = require("../settings.json");
exports.run = (client, msg, args, db, util) => {
  switch (args[0]) {
    case "accept":
      id = args[1];
      if (isNaN(id)) return msg.channel.send("Please make sure you're using an ID.")
      client.channels.get(settings.suggestions).fetchMessage(id).then(message => {
        const embed = new Discord.RichEmbed()
          .setColor(0x00ff00)
          .setFooter(`Decided by: ${msg.author.username} Date: ${date(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
          .setTitle(`Accepted Suggestion:`)
          .setDescription(message.embeds[0].description)
        message.edit(embed)
      });
      break;
    case "decline":
      id = args[1];
      if (isNaN(id)) return msg.channel.send("Please make sure you're using an ID.")
      client.channels.get(settings.suggestions).fetchMessage(id).then(message => {
        const embed = new Discord.RichEmbed()
          .setColor(0xff0000)
          .setFooter(`Decided by: ${msg.author.username} Date: ${date(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
          .setTitle(`Declined Suggestion:`)
          .setDescription(message.embeds[0].description)
        message.edit(embed)
      });
      break
    case "maybe":
      id = args[1];
      if (isNaN(id)) return msg.channel.send("Please make sure you're using an ID.")
      client.channels.get(settings.suggestions).fetchMessage(id).then(message => {
        const embed = new Discord.RichEmbed()
          .setColor(0xffd540)
          .setFooter(`Decided by: ${msg.author.username} Date: ${date(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
          .setTitle(`Potential Suggestion:`)
          .setDescription(message.embeds[0].description)
        message.edit(embed)
      });
      break;
    default:
      let suggestion = args.slice(0).join(' ')
      if (!suggestion) return msg.channel.send("Make sure to supply a suggestion.");
      const embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .setFooter(`Date: ${date(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
        .setTitle(`New Suggestion:`)
        .setDescription(suggestion)
      client.channels.get(settings.db.suggestions).send(embed);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['Suggest', 'suggestion'],
};

exports.help = {
  name: 'suggest',
  description: 'Allows you to sugggest new additions to my bot/servers.',
  usage: 'suggest (suggestion)',
};
