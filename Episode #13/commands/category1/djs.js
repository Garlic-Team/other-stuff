/* Djs V13, GCommands v5
 * By Hyro, Pog Fish
 * Emojis: https://github.com/Garlic-Team/Tutorials/raw/main/features/assets/djs_emojis.zip
*/

const { Command, ArgumentType } = require('gcommands');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Docs = require('discord.js-docs')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "djs",
            description: "Discord.js documentation",
            guildOnly: "747526604116459691",
            args: [
                {
                    name: "query",
                    type: ArgumentType.STRING,
                    description: "query",
                    required: true
                },
                {
                    name: "target",
                    type: ArgumentType.USER,
                    description: "suggestion for"
                },
                {
                    name: "branch",
                    type: ArgumentType.STRING,
                    description: "branch"
                }
            ],
            context: false
        })
    }

    async run({client, respond, edit, channel, member}, _, args) {
        if(!args.branch) args.branch = "stable";

        this.docs = await Docs.fetch(args.branch);

        let res = this.docs.get(...args.query.split(/\.|#/));
        if(res) return respond(this.formatRespond(client, args, res));

        res = this.docs.search(args.query);
        respond({ 
            content: "No match. Select a similar search result to send it:", 
            ephemeral: true, 
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`selectDocs`)
                        .setPlaceholder(`Make a selection`)
                        .setMaxValues(1)
                        .setMinValues(1)
                        .addOptions(
                            await this.buildSelectOptions(client, res)
                        )
                )
            ]
        });

        const filter = (interaction) => interaction.isSelectMenu() && interaction.customId === 'selectDocs' && interaction.user.id === member.user.id;
        const output = await channel.awaitMessageComponent({ filter, time: 120000 });
        if(!output) return edit({ content: "You have not replied within 2 minutes.", components: [] })

        edit({ content: "Suggestion sent.", components: [] });
        return output.reply.send(this.formatRespond(client, args, this.docs.get(...output.values[0].split(/\.|#/))));
    }

    buildSelectOptions(client, elements) {
        let transformDesc = (res) => {
            res = res.split("\n")[0];
            return res.length > 47 ? `${res.trim().split(0, 47)}...` : res
        }
        
        return elements.map(element => {
            let emoji = client.emojis.cache.find(e => e.name === `djs_${element.docType}`);
            return {
                label: element.formattedName,
                value: element.formattedName,
                description: transformDesc(element.formattedDescription || element.description || 'No description found'),
                emoji: {
                    id: emoji.id
                }
            }
        })
    }

    formatRespond(client, args, element) {
        const parts = [];
        if (args.target) parts.push(`*Documentation suggestion for <@${args.target}>*\n`);
        let emoji = client.emojis.cache.find(e => e.name === `djs_${element.docType}`);
        if (emoji) parts.push(`${emoji.toString()} `);
        if (element.static) parts.push('**(static)** ');
        parts.push(`__**${this.replaceLinks(element.link ?? '')}**__`);
        if (element.extends) parts.push(this.formatInheritance('extends', element.extends));
        if (element.implements) parts.push(this.formatInheritance('implements', element.implements));
        if (element.access === 'private') parts.push(' **PRIVATE**');
        if (element.deprecated) parts.push(' **DEPRECATED**');

        const formattedDescription = this.replaceLinks(element.formattedDescription ?? element.description ?? '').split('\n');
        const description = formattedDescription.length > 1 ? `${formattedDescription[0]} [(more...)](<${element.url ?? ''}>)` : formattedDescription[0];
        return `${parts.join('')}\n${description}`;
    }

    formatInheritance(prefix, inherits) {
        const res = inherits.map((element) => element.flat(5));
        return ` (${prefix} ${res.map((element) => this.replaceLinks(this.docs.formatType(element))).join(' and ')})`;
    }

    replaceLinks(string) {
        return string.replace(/\[(.+?)\]\((.+?)\)/g, '[$1](<$2>)')
    }
}
