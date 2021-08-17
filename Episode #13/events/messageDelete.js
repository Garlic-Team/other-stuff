const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "messageDelete",
    once: false,
    run: async(client, message) => {
        let mention = message.mentions.users ? message.mentions.users.first() : null
        if(mention) {
            let embed = new MessageEmbed()
                .setAuthor(message.author.tag)
                .setDescription(`${message.author} ghost pinged ${mention}`)
                .setTimestamp();
            
            client.channels.cache.get("862700556438732851").send(
                embed
            )

            message.channel.send(`${message.author} -> ${message.cleanContent}`);
        }
    }
}