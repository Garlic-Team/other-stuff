require('dotenv').config();
const { Client } = require('discord.js');
const RSSParser = require('rss-parser');
const urlRegexp = /(https?:\/\/[^ ]*)/;

const client = new Client({
    intents: ['GUILDS','GUILD_MESSAGES']
})

const request = new RSSParser();

client.on('ready', async() => {
    const ytChannel = await client.channels.fetch(process.env.NOTIFICATION_CHANNEL_ID);

    setInterval(async() => {
        const req = (await request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YOUTUBE_CHANNEL_ID}`)).items[0];

        let ifAlready = [...(await ytChannel.messages.fetch({ limit: 1 })).values()]
        if (ifAlready.length > 0) ifAlready = ifAlready[0].content.match(urlRegexp);
        if (ifAlready != null) ifAlready = ifAlready[1];
        if (ifAlready == req.link) return;

        ytChannel.send(`${process.env.NEW_POST_MESSAGE.replace(`{url}`,req.link)}`);
    }, 15000)
})

client
    .on('log', console.log)
    .on('debug', console.log);

client.login(process.env.DISCORD_TOKEN);