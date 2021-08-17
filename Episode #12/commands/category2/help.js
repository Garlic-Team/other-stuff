const { MessageEmbed } = require("discord.js")
const { Command } = require("gcommands")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "help",
            description: "help command",
            guildOnly: "747526604116459691",
            category: "category2"       
        })
    }

    async run({client, respond}) {
        let embed = new MessageEmbed()
            .setColor("YELLOW")

        const commandCategory = (category) => {
            return client.gcommands
                .filter(cmd => cmd.category == category)
                .map(cmd => `\`${cmd.name}\``)
                .join(", ")
        }

        const info = client.gcategories.map(cmd => `**${cmd[0].toUpperCase() + cmd.slice(1)}**\n${commandCategory(cmd)}`).reduce((string, category) => `${string}\n${category}`)
        respond(embed.setDescription(info))
    }
}