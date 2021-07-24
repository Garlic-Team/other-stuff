const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "help command",
    guildOnly: "747526604116459691",
    category: "category2",
    run: async({client, respond}) => {
        let embed = new MessageEmbed()
            .setColor("YELLOW")

        const commandCategory = (category) => {
            return client.gcommands
                .filter(cmd => cmd.gcategory == category)
                .map(cmd => `\`${cmd.name}\``)
                .join(", ")
        }

        const info = client.categories.map(cmd => `**${cmd[0].toUpperCase() + cmd.slice(1)}**\n${commandCategory(cmd)}`).reduce((string, category) => `${string}\n${category}`)
        respond(embed.setDescription(info))
    }
}
