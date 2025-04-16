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

const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const commands = [];

// Baca semua command yang punya `data` (berarti slash command)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Daftarkan slash commands global
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
