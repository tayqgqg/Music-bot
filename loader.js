const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const fs = require("fs");
const path = require("path");
const { Translate, GetTranslationModule } = require("./process_tools");

client.commands = new Collection();
const commandsArray = [];
const player = useMainPlayer();

const discordEvents = readdirSync(path.join(__dirname, "events", "Discord")).filter(file => file.endsWith(".js"));
const playerEvents = readdirSync(path.join(__dirname, "events", "Player")).filter(file => file.endsWith(".js"));

const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

GetTranslationModule().then(() => {
  console.log("| Translation Module Loaded |");

  // ** Load Discord Events **
  discordEvents.forEach(file => {
    const DiscordEvent = require(path.join(__dirname, "events", "Discord", file));
    const eventName = file.split(".")[0];
    const txtEvent = `< -> > [Loaded Discord Event] <${eventName}>`;
    parseLog(txtEvent);
    client.on(eventName, DiscordEvent.bind(null, client));
    delete require.cache[require.resolve(path.join(__dirname, "events", "Discord", file))];
  });

  // ** Load Player Events **
  playerEvents.forEach(file => {
    const PlayerEvent = require(path.join(__dirname, "events", "Player", file));
    const eventName = file.split(".")[0];
    const txtEvent = `< -> > [Loaded Player Event] <${eventName}>`;
    parseLog(txtEvent);
    player.events.on(eventName, PlayerEvent.bind(null));
    delete require.cache[require.resolve(path.join(__dirname, "events", "Player", file))];
  });

  // ** Load Commands **
  commandFolders.forEach(dirs => {
    const commands = readdirSync(path.join(__dirname, 'commands', dirs)).filter(file => file.endsWith(".js"));

    commands.forEach(file => {
      const command = require(path.join(__dirname, 'commands', dirs, file));
      if (command.name && command.description) {
        commandsArray.push(command);
        const txtEvent = `< -> > [Loaded Command] <${command.name.toLowerCase()}>`;
        parseLog(txtEvent);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(path.join(__dirname, 'commands', dirs, file))];
      } else {
        const txtEvent = `< -> > [Failed Command] <${file}>`;
        parseLog(txtEvent);
      }
    });
  });

  // ** Register Slash Commands **
  client.on("ready", () => {
    const { global, guild } = client.config.app;
    const commandSet = global ? client.application.commands.set(commandsArray) : client.guilds.cache.get(guild).commands.set(commandsArray);
  });

  // ** Log Translations **
  async function parseLog(txtEvent) {
    console.log(await Translate(txtEvent, null));
  }
});
