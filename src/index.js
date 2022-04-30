require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const tiktok = require('tiktok-scraper');
const urlRegexp = /(https?:\/\/[^ ]*)/;

const client = new Client({
    intents: ['GUILDS','GUILD_MESSAGES']
})

const resolveId = async () => (await tiktok.getUserProfileInfo(process.env.TIKTOK_ACCOUNT)).userId;

client.on('ready', async() => {
    const tiktokChannel = await client.channels.fetch(process.env.NOTIFICATION_CHANNEL_ID);
    const userID = await resolveId();
    const user = await tiktok.user(userID);

    setInterval(async() => {
        const { collector: newPosts } = user;
        if (newPosts.length === 0) return;

        const post = newPosts[0];
        const author = post.authorMeta.nickName;
        const link = post.webVideoUrl;

        let ifAlready = [...(await tiktokChannel.messages.fetch({ limit: 1 })).values()];
        if (ifAlready.length > 0) ifAlready = ifAlready[0].content.match(urlRegexp);
        if (ifAlready != null) ifAlready = ifAlready[1];
        if (ifAlready == link) return;

        const embed = new MessageEmbed()
            .setAuthor({ name: author, iconURL: post.authorMeta.avatar })
            .setTitle(post.text)
            .setImage(post.covers.default)
            .setColor('#7f47cc')
            .setTimestamp()
            .setFooter({ text: `Fans: ${new Intl.NumberFormat().format(post.authorMeta.fans)} | Videos: ${new Intl.NumberFormat().format(post.authorMeta.video)} | Hearts: ${new Intl.NumberFormat().format(post.authorMeta.heart)}` });

        tiktokChannel.send({
            content: process.env.NEW_POST_MESSAGE.replace(`{url}`,link),
            embeds: [embed]
        });
    }, 15000)
})

client
    .on('log', console.log)
    .on('debug', console.log);

client.login(process.env.DISCORD_TOKEN);
