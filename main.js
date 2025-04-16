require('dotenv').config();  // Memuat file .env untuk mendapatkan variabel lingkungan

const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { prefix } = require('./config.js');  // Menggunakan config.js untuk mendapatkan prefix
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
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

client.commands = new Map();  // Menyimpan semua perintah di sini

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
    if (!message.content.startsWith(prefix)) return;  // Memeriksa apakah pesan menggunakan prefix yang valid

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

client.login(process.env.BOT_TOKEN);  // Menggunakan token dari .env

// Menyiapkan dan mendaftar Slash Commands
const commands = [];

// Baca semua command di folder 'commands' yang memiliki property 'data'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Daftarkan slash commands secara global
(async () => {
    try {
        console.log('Mengupdate slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('✅ Slash commands berhasil diperbarui!');
    } catch (error) {
        console.error('❌ Gagal mendaftar slash commands:', error);
    }
})();
