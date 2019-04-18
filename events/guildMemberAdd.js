const db = require('../Util/db.js');
const settings = require("../settings.json");
module.exports = (guildMember) => {
db.MongoFind(settings.db.PasswordCollection, {
    id: guildMember.guild.id
  }).then(info => {
    if (!info[0]) return;
    guildMember.addRole(info[0].roleID).catch(console.error);
  });
};
