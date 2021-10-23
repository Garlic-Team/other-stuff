require("dotenv").config();
const { GCommandsClient } = require("gcommands");

const client = new GCommandsClient({
    cmdDir: "commands/",
    language: "english",
    commands: {
        slash: true,
        context: false,
        prefix: "."
    },
    intents: ["GUILDS","GUILD_MESSAGES"]
})

client.tiktok = require('tiktok-scraper')
client.config = require("./config.json")

const resolveId = async () => (await client.tiktok.getUserProfileInfo(client.config.tiktokAccount)).userId

client.on("ready", async() => {
    const userID = await resolveId();
    client.tiktokUser = await client.tiktok.user(userID);
    setInterval(async() => {
        const { collector: newPosts } = client.tiktokUser;
        if (newPosts.length === 0) return;
        let urlRegexp = /(https?:\/\/[^ ]*)/
        
        let tiktokChannel = client.channels.cache.get(client.config.notificationChannelId);

        let post = newPosts[0];
        let author = post.authorMeta.nickName;
        let link = post.webVideoUrl;

        let ifAlready = [...(await tiktokChannel.messages.fetch({ limit: 1 })).values()];
        if (ifAlready.length > 0) ifAlready = ifAlready[0].content.match(urlRegexp);
        if (ifAlready != null) ifAlready = ifAlready[1];
        if (ifAlready == link) return;

        const embed = new MessageEmbed()
            .setAuthor(author, post.authorMeta.avatar)
            .setTitle(post.text)
            .setImage(post.covers.default)
            .setColor('#7f47cc')
            .setTimestamp()
            .setFooter(`Fans: ${new Intl.NumberFormat().format(post.authorMeta.fans)} | Videos: ${new Intl.NumberFormat().format(post.authorMeta.video)} | Hearts: ${new Intl.NumberFormat().format(post.authorMeta.heart)}`)

        tiktokChannel.send({content: `${client.config.newPostMessage.replace(`{url}`,link)}`, embeds: [embed]})
    }, 15000)
})

client
    .on("log", console.log)
    .on("debug", console.log);

client.login(process.env.token)
