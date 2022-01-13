require('dotenv').config();
const { Intents } = require('discord.js');
const path = require('path');
const ModMailClient = require('./structures/ModMailClient');

const client = new ModMailClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
    language: 'english',
    dirs: [
        path.join(__dirname, 'events')
    ],
    partials: ['MESSAGE', 'CHANNEL'],
    token: process.env.DISCORD_TOKEN,
});

client.run();