require("dotenv").config();
const { GCommandsClient } = require("gcommands"),
    RSSParser = require("rss-parser");

const client = new GCommandsClient({
    loader: {
        cmdDir: __dirname + "/commands/",
    },
    language: "english",
    commands: {
        slash: 'slash',
        context: false,
        prefix: "."
    },
    intents: ["GUILDS","GUILD_MESSAGES"]
})

client.request = new RSSParser();
client.config = require("./config.json");

client.on("ready", async() => {
    setInterval(async() => {
        let ytChannel = client.channels.cache.get(client.config.notificationChannelId);
        let urlRegexp = /(https?:\/\/[^ ]*)/

        let req = (await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.youtubeChannelId}`)).items[0];

        let ifAlready = [...(await ytChannel.messages.fetch({ limit: 1 })).values()]
        if (ifAlready.length > 0) ifAlready = ifAlready[0].content.match(urlRegexp);
        if (ifAlready != null) ifAlready = ifAlready[1];
        if (ifAlready == req.link) return;

        ytChannel.send(`${client.config.newVideoMessage.replace(`{url}`,req.link)}`);
    }, 15000)
})

client
    .on("log", console.log)
    .on("debug", console.log);

client.login(process.env.token)
