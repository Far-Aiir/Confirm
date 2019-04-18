const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const fs = require('fs')
const db = require('./Util/db.js');
require('./Util/eventLoader.js')(client)
const chalk = require('chalk');
let log = console.log;

db.MongoConnect();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  log(`Loading a total of ${files.length} commands.`)
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading Command ${chalk.blue(props.help.name)}`)
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.named)
    })
  })
})
client.reload = function(command) {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.login(settings.token)
