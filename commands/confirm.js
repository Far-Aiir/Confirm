const settings = require('../settings.json');
exports.run = (client, msg, args, db, util) => {
  switch (args[0]) {
    case "new":
      function rand() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
      db.MongoFind(settings.db.PasswordCollection, {
        id: msg.guild.id
      }).then(info => {
        if (info[0]) return msg.channel.send("You already have a password set on this server, you can either update it, or delete it.")
        let pass = args.slice(1).join();
        if (pass.length > 5) return msg.channel.send("Sorry, the channels password cannot have more than 5 characters.");
        if (!pass) pass = rand();
        if (msg.guild.roles.find('name', 'Unauthorized')) {
          msg.guild.roles.find('name', 'Unauthorized').delete();
        console.log('d')}
        msg.guild.createRole({
          name: "Unauthorized"
        }).then(role => {
          let confirm = {
            id: msg.guild.id,
            chanID: msg.channel.id,
            chanName: msg.channel.name,
            roleID: role.id,
            roleName: role.name,
            password: pass,
            addedBy: msg.author.id,
            dateAdded: Date.now(),
          }
          msg.channel.send("Hello, please type: " + pass + " to get access to the other channels.")
          db.MongoInsert(settings.db.PasswordCollection, confirm);
          msg.guild.channels.map(c => c.id).forEach(id => {
            msg.guild.channels.get(id).overwritePermissions(role.id, {
              VIEW_CHANNEL: false,
              SEND_MESSAGES: false
            });
            msg.guild.channels.get(msg.channel.id).overwritePermissions(role.id, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true
            });
          });
        });
      });
      break;
    case "update":
      pass = args.slice(1).join();
      db.MongoFind(settings.db.PasswordCollection, {
        id: msg.guild.id
      }).then(info => {
        if (!info[0]) return msg.channel.send("Make sure there is a password on you server before attempting to update it.");
        if (info[0].password == pass && info[0].chanID == msg.channel.id) return msg.channel.send("Make sure to change something.");
        if (!pass) pass = info[0].password;
        db.MongoUpdate(settings.db.PasswordCollection, {
          id: msg.guild.id
        }, {
            chanID: msg.channel.id,
            password: pass
          });
        msg.guild.channels.map(c => c.id).forEach(id => {
          msg.guild.channels.get(id).overwritePermissions(info[0].roleID, {
            VIEW_CHANNEL: false
          });
          msg.guild.channels.get(msg.channel.id).overwritePermissions(info[0].roleID, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
          });
        });
        msg.channel.send("Successfully updated!\nPassword: " + info[0].password + "\nChannel: " + client.channels.get(info[0].chanID).name)
      });
      break;
    case "delete":
      db.MongoFind(settings.db.PasswordCollection, {
        id: msg.guild.id
      }).then(info => {
        if (!info[0]) return msg.channel.send("I cannot find this server in the DB, did you set a password?")
        db.MongoDelete(settings.db.PasswordCollection, {
          id: msg.guild.id
        });
        msg.channel.send("You have successfully deleted this server from the DB.")
      });
      break;
    case "show":
      db.MongoFind(settings.db.PasswordCollection, {
        id: msg.guild.id
      }).then(info => {
        if (!info[0]) return msg.channel.send("Make sure to put a password on your server.")
        msg.channel.send("Channel: " + client.channels.get(info[0].chanID).name + '\nPassword: ' + info[0].password)
      })
      break;
    default:
      msg.channel.send("Hello, if you want to know what each command does, go to this link here: https://pastebin.com/Jz4TTGrd \nIt's at the very bottom.")
  }
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['conf'],
};

exports.help = {
  name: 'confirm',
  description: 'Allows you to set a password on your guild which makes users type the password to get access to the server.',
  usage: 'Confirm [new (pass)/update (new pass)/delete/show]',
};
