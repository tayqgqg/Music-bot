const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'play',
    description: 'Putar lagu',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'Lagu yang ingin kamu putar',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    // Slash Command
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Putar lagu')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Lagu yang ingin diputar')
                .setRequired(true)
        ),

    // Hybrid command handler
    async execute({ inter, message, client }) {
        const player = useMainPlayer();
        const song = inter ? inter.options.getString('song') : message.content.split(' ').slice(1).join(' ');

        if (!song) {
            return inter ? inter.reply({ content: 'Mohon berikan nama lagu.', ephemeral: true }) : message.reply('Mohon berikan nama lagu.');
        }

        const res = await player.search(song, {
            requestedBy: inter ? inter.member : message.author,
            searchEngine: QueryType.AUTO,
        });

        let defaultEmbed = new EmbedBuilder().setColor('#2f3136');

        if (!res?.tracks.length) {
            defaultEmbed.setAuthor({ name: await Translate(`Tidak ditemukan hasil... coba lagi? <❌>`) });
            return inter ? inter.editReply({ embeds: [defaultEmbed] }) : message.reply({ embeds: [defaultEmbed] });
        }

        try {
            const { track } = await player.play(
                inter ? inter.member.voice.channel : message.member.voice.channel, song, {
                    nodeOptions: {
                        metadata: {
                            channel: inter ? inter.channel : message.channel,
                        },
                        volume: client.config.opt.volume,
                        leaveOnEmpty: client.config.opt.leaveOnEmpty,
                        leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                        leaveOnEnd: client.config.opt.leaveOnEnd,
                        leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                    },
                }
            );

            defaultEmbed.setAuthor({ name: await Translate(`Memuat <${track.title}> ke antrian... <✅>`) });
            return inter ? inter.editReply({ embeds: [defaultEmbed] }) : message.reply({ embeds: [defaultEmbed] });
        } catch (error) {
            console.log(`Play error: ${error}`);
            defaultEmbed.setAuthor({ name: await Translate(`Saya tidak bisa bergabung ke channel suara... coba lagi? <❌>`) });
            return inter ? inter.editReply({ embeds: [defaultEmbed] }) : message.reply({ embeds: [defaultEmbed] });
        }
    },
};
