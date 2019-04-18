let settings = require('../settings.json');
let db = require('../Util/db.js');
module.exports = (guild, client) => {
  db.MongoFind(settings.db.PasswordCollection, {
    id: guild.id
  }).then(found => {
    if (!found[0]) return guild.client.guilds.get("432438266634043392").channels.get("432667648719978508").send(`ID: ${guild.id}\nDBAction: None.\nDate: ${new Date()}\nReason: No longer in the guild.\n`);
    db.MongoDelete(settings.db.PasswordCollection, {
      id: guild.id
    }).then(guild.client.guilds.get("432438266634043392").channels.get("432667648719978508").send(`ID: ${guild.id}\nDBAction: Server Key Deleted.\nDate: ${new Date()}\nReason: No longer in the guild.\n`))
  }).catch(console.error);
};
