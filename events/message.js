const date = require('dateformat');
const settings = require('../settings.json');
const Discord = require('discord.js');
const db = require('../Util/db.js');
let util = require('../Util/utils.js');
module.exports = (message) => {
  const client = message.client;
  global.msg = message;
  if (msg.channel.type !== 'dm') {
    db.MongoFind(settings.db.PasswordCollection, {
      id: msg.guild.id
    }).then(info => {
      if (!info[0]) return;
      if (info[0].chanID == msg.channel.id) {
        if (msg.content == info[0].password) {
          msg.guild.members.get(msg.author.id).removeRole(info[0].roleID).catch(console.error);
          console.log(`${msg.author.username} has typed the password (${info[0].password}) in: ${msg.guild.name}`)
          client.channels.get(settings.logging).send(msg.author.username + " has typed the password: " + info[0].password + " in: " + msg.guild.name)
          msg.guild.channels.get(msg.channel.id).overwritePermissions(msg.guild.id, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false
          });
          msg.delete().catch(err => {
            client.users.get(msg.guild.ownerID).send("Hmm, I seem to be missing the MANAGE MESSAGES permissions in: " + msg.guild.name + " there might be error's if you don't enable it.\n\nConsole Error: " + err)
          });
        } else {
          client.users.get(msg.author.id).send("\`\`\`prolog\nWARNING: incorrect password.\`\`\`").catch(console.error);
          msg.delete().catch(err => {
            client.users.get(msg.guild.ownerID).send("Hmm, I seem to be missing the MANAGE MESSAGES permissions in: " + msg.guild.name + " there might be error's if you don't enable it.\n\nConsole Error: " + err)
          });
        }
      }
    });
    if (!msg.content.startsWith(settings.prefix)) return;
    db.MongoFind(settings.db.userCollection, {
      id: msg.author.id
    }).then(info => {
      if (!info[0]) {
        var user = {
          id: msg.author.id,
          name: msg.author.username,
          dateAdded: Date.now(),
          info: {
            mod: false,
            admin: false,
            banned: false,
            bannedBy: null,
            bannedFor: null,
            banDate: null,
            uPrefix: "c/",
          }
        };
        db.MongoInsert(settings.db.userCollection, user);
      } else {
        const BanEmbed = new Discord.RichEmbed()
          .setColor(0xffffff)
          .setFooter(`Date banned: ${date(info[0].info.banDate, "dddd, mmmm dS, yyyy, h:MM:ss TT")}`)
          .setTitle(`${client.users.get(info[0].id).username}, you have been blacklisted.`)
          .setDescription(`\`\`\`prolog\nUser: ${info[0].name}\nReason: ${info[0].info.bannedFor}\nBanned By: ${info[0].info.bannedBy}\`\`\``)
        if (info[0].info.banned == true) return msg.channel.send(BanEmbed);
      }
      let args = msg.content.split(' ');
      let cmd = args.shift().slice(settings.prefix.length);
      try {
        let commandFile = require(`../commands/${cmd}.js`);
        commandFile.run(client, msg, args, db, util)
        console.log(msg.author.username + " | " + msg.content);
      } catch (e) {
        console.log('Command Failed: ' + e.message);
      }
    });
  } else {
    if (!msg.content.startsWith(settings.prefix)) return;
    msg.channel.send("This bot can only be used in a server.")
  }
};
