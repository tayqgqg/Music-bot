
module.exports = {
    app: {
    token: process.env.DISCORD_TOKEN || 'your-token-here',
    playing: 'punyaa ardyy🥱',
    global: true,
    guild: process.env.GUILD_ID || 'xxx',
    prefix: '!', // Tambahkan baris ini
    extraMessages: false,
    loopMessage: false,
    lang: 'en',
    enableEmojis: false,
},

    emojis:{
        'back': '⏪',
        'skip': '⏩',
        'ResumePause': '⏯️',
        'savetrack': '💾',
        'volumeUp': '🔊',
        'volumeDown': '🔉',
        'loop': '🔁',
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        Translate_Timeout: 10000,
        maxVol: 1000,
        spotifyBridge: true,
        volume: 100,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
