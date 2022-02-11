const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Command } = require("gcommands");
const { Inhibitor: { UserPermissions } } = require("gcommands");

class Send extends Command {
    constructor() {
        super({
            name: 'send',
            description: 'Send ticket panel',
            guildId: '747526604116459691',
            inhibitors: [
                new UserPermissions({
                    permissions: ['MANAGE_GUILD']
                })
            ]
        });
    }

    run({ client, reply }) {
        const embed = new MessageEmbed()
            .setAuthor(client.config.embed.author)
            .setDescription(client.config.embed.description)
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)

        if (client.config.embed.timestamp) embed.setTimestamp();

        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setLabel(client.config.button.label)
                    .setStyle(client.config.button.style)
                    .setCustomId('create_ticket')
            ])

        reply({
            embeds: [embed],
            components: [row]
        })
    }
}

module.exports = Send;