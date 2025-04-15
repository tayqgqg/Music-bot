// === KEEP-ALIVE UNTUK RAILWAY ===
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(process.env.PORT || 3000);

// === DOTENV & DISCORD BOT ===
require('dotenv').config();

const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const { YoutubeiExtractor } = require('discord-player-youtubei'); // Import the new extractor

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    presence: {
        status: 'idle',
        activities: [{
            name: 'punyaa ardyy🥱',
            type: 3
        }]
    },
    disableMentions: 'everyone',
});

// Custom Prefix
const prefix = '*'; // Ganti dengan prefix yang kamu inginkan

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Jangan proses pesan dari bot lain
    
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Misalnya, perintah untuk play music
        if (command === 'play') {
            // Logika untuk perintah 'play'
        }

        // Tambahkan perintah lainnya di sini
    }
});

client.login(process.env.DISCORD_TOKEN);

client.config = require('./config');

const player = new Player(client, client.config.opt.discordPlayer);
// Register the new Youtubei extractor
player.extractors.register(YoutubeiExtractor, {});

console.clear();
require('./loader');

client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tChange the token in the config file\n');
    } else {
        console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e);
    }
});
