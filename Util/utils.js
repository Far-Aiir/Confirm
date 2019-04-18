const Discord = require('discord.js');
module.exports.randHex = () => '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)
module.exports.SendCompactRichEmbed = (title, color, description) => {
  return new Promise((resolve, reject) => {
    if (color == null) color = module.exports.randHex();
    const embed = new Discord.RichEmbed()
      .setTitle(title, true)
      .setAuthor(msg.author.username)
      .setColor(color)
      .setDescription(description, true)
      .setThumbnail("https://cdn.discordapp.com/avatars/"+ client.user.id +"/" + client.user.icon + ".png?size=128")
      .setTimestamp()
    msg.channel.send(embed).catch(error => {
      reject(error);
    });
    resolve();
  });
};
