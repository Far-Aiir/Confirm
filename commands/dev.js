const settings = require('../settings.json');
let uuid;
const exec = require('child_process').exec;
exports.run = (client, msg, args, db, util) => {
  db.MongoFind(settings.db.userCollection, {
    id: msg.author.id
  }).then(info => {
    if (info[0].info.admin !== true) return msg.channel.send("These commands are **strictly** for the bots developers use.")
    switch (args[0]) {
      case "eval":
        const clean = text => {
          function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
              return text;
          }
          if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        };
        try {
          const code = args.slice(1).join(" ");
          const log = console.log;
          const key = Object.keys;
          let evaled = eval(code);
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
          msg.channel.send(`:inbox_tray: INPUT:\`\`\`x1\n${msg.content}\`\`\` :outbox_tray: OUTPUT:  \`\`\`prolog\n${clean(evaled)}\`\`\``);
        } catch (err) {
          msg.channel.send(`:inbox_tray: INPUT: \`\`\`${msg.content} \`\`\`\n:outbox_tray: ERROR:  \`\`\`prolog\n${clean(err)}\n\`\`\``);
        }
        break;
      case "exec":
        exec(args.slice(1).join(' '), (error, stdout) => {
          const response = (error || stdout);
          msg.channel.send({
            embed: {
              color: 3447003,
              author: {},
              fields: [{
                name: ":inbox_tray: Input:",
                inline: false,
                value: "```" + msg.content + "```"
              }, {
                name: ":outbox_tray: Output:",
                inline: false,
                value: "```" + response + "```"
              }],
              footer: {}
            }
          });
        });
        break;
      case "DB":
        switch (args[1]) {
          case "ban":
            uuid = args[2];
            let reason = args.slice(3).join(' ');
            if (!reason) reason += "No reason was specified.";
            if (!uuid) return msg.channel.send("Please make sure to use a users ID.")
            db.MongoFind(settings.db.userCollection, {
              id: uuid
            }).then(info => {
              if (!info) return msg.channel.send("This user doesn't seem to be in the database.");
              if (info[0].info.banned == true) return msg.channel.send("This user is already banned.");
            })
            db.MongoUpdate(settings.db.userCollection, {
              id: uuid
            }, {
              info: {
                mod: false,
                admin: false,
                banned: true,
                bannedBy: msg.author.id,
                bannedFor: reason,
                banDate: new Date(),
                uPrefix: 'c/'
              }
            });
            msg.channel.send("User banned successfully.")
            break;
          case "unban":
            uuid = args[2];
            db.MongoFind(settings.db.userCollection, {
              id: uuid
            }).then(info => {
              if (!info) return msg.channel.send("This user doesn't seem to be in the database.");
              if (info[0].info.banned == false) return msg.channel.send("This user is already unbanned.");
            });
            db.MongoUpdate(settings.db.userCollection, {
              id: uuid
            }, {
              info: {
                mod: false,
                admin: false,
                banned: false,
                bannedBy: null,
                bannedFor: null,
                banDate: null,
                uPrefix: "c/"
              }
            })
            msg.channel.send("User unbanned successfully.")
            break;
        }
        break;
      case "reload":
        let command;
        if (client.commands.has(args[1])) {
          command = args[1];
        } else if (client.aliases.has(args[1])) {
          command = client.aliases.get(args[1]);
        }
        if (!command) {
          var cmd = [client.commands.map(n => n.help.name)]
          for (var i in cmd) {
            cmd[i].forEach(cmds => {
              client.reload(cmds);
            });
            msg.channel.send("All commands have been reloaded!")
          }
        } else {
          msg.channel.send(`Reloading: ${command}`)
            .then(m => {
              client.reload(command)
                .then(() => {
                  m.edit(`Successfully reloaded: ${command}`);
                })
                .catch(e => {
                  m.edit(`command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
                });
            });
        }
        break;
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['DEV'],
};

exports.help = {
  name: 'dev',
  description: 'For the developer(s) of the bot.',
  usage: 'Don\'t worry about it.',
};
