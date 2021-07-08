module.exports = {
    name: "message",
    once: false,
    run: async(client, message) => {
        console.log(message.author.tag + " > " + message.cleanContent)

        if(message.channel.type == "news") {
            let posted = await message.crosspost();
            message.guild.channels.cache.get(`855733662268391424`).send(`Posted https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id} in \`${Date.now() - posted.createdTimestamp}ms\``)
        }
    }
}