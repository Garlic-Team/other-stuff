require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js"),
    { GCommands } = require("gcommands"),
    RSSParser = require("rss-parser")

const client = new Client();
client.request = new RSSParser();
client.config = require("./config.json")

client.on("ready", async() => {
    const gc = new GCommands(client, {
        cmdDir: "commands/",
        language: "english",
        slash: {
            slash: true,
            prefix: "."
        }
    })

    gc.on("log", console.log)
    gc.on("debug", console.log)

    setInterval(async() => {
        let ytChannel = client.channels.cache.get(client.config.notificationChannelId)
        let urlRegexp = /(https?:\/\/[^ ]*)/

        let req = (await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.youtubeChannelId}`)).items[0]

        let ifAlready = (await ytChannel.messages.fetch({ limit: 1 })).array()[0].content.match(urlRegexp)[1];
        if(ifAlready == req.link) return;

        ytChannel.send(`${client.config.newVideoMessage.replace(`{url}`,req.link)}`)
    }, 15000)
})

client.login(process.env.token)