require('dotenv').config();  // Memuat file .env

const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { prefix } = require('./config.js');  // Ambil prefix dari config.js
const fs = require('fs');

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

client.commands = new Map();  // Simpan perintah di sini

// Load semua command dari folder /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event prefix command
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi kesalahan saat menjalankan perintah.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
