require('dotenv').config();
const { Intents } = require('discord.js');
const path = require('path');
const TicketClient = require('./structures/TicketClient');

const client = new TicketClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    dirs: [
        path.join(__dirname, 'commands'),
        path.join(__dirname, 'events'),
    ],
    token: process.env.DISCORD_TOKEN,
});

client.parseConfig();