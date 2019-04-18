const Discord = require('discord.js');
const fs = require('fs')
const settings = require('../settings.json');
exports.run = (client, msg, args, db, util) => {
  db.MongoFind(settings.db.userCollection, {}).then(info => {
    global.DBUsersSize = Object.keys(info).length;
  });
  db.MongoFind(settings.db.PasswordCollection, {}).then(info => {
    global.DBConfirmSize = Object.keys(info).length;
  });
  fs.readdir('./commands', (err, files) => {
    if (err) throw err;
    String.prototype.toHHMMSS = function() {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      var time = hours + ':' + minutes + ':' + seconds;
      return time;
    }
    var time = process.uptime();
    var uptime = (time + "").toHHMMSS();
    msg.channel.send("Getting info:").then(message => {
      var shards = client.shard;
      if (shards === null) shards = "0"
      var arr = [
        `Users: ${client.users.size}`,
        `Servers: ${client.guilds.size}`,
        `DB Users: ${DBUsersSize}`,
        `DB Servers: ${DBConfirmSize}`,
        `Shards: ${shards.count}`,
        `Commands: ${files.length}`,
        `Uptime: ${uptime}`,
        // `Bot Invite: [Confirm](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958591)`,
        // `Server Invite: [Support](http://discordapp.com/invite/GXBbFmn)`,
        `Message Latency: ${message.createdTimestamp - msg.createdTimestamp}ms`,
        `API Latency: ${client.ping}ms`
      ]
      const embed = new Discord.RichEmbed()
        .setColor(0xdd0ee2)
        .setFooter("Info requested by: " + msg.author.username)
        .setTitle("Confirm info:")
        .setDescription(arr)
      message.edit(embed)
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['Info'],
};

exports.help = {
  name: 'info',
  description: 'Displays information about the bot.',
  usage: 'info',
};
