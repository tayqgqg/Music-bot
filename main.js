const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei'); // Import the new extractor
const { prefix } = require('./config.json'); // Pastikan kamu punya file config.json untuk prefix

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    presence: {
        status: 'idle',
        activities: [{
            name: 'YouTube Ardyy',
            type: 'WATCHING',
        }],
    },
    disableMentions: 'everyone',
});

client.commands = new Map(); // Simpan semua perintah disini

// ** Slash Commands **
client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Terjadi kesalahan!', ephemeral: true });
        }
    }
});

// ** Prefix Commands **
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;  // Hanya perintah dengan prefix yang diproses

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi kesalahan dalam menjalankan perintah.');
        }
    }
});

client.login(process.env.BOT_TOKEN);
