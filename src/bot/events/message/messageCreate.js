const { Message, Client } = require('discord.js');
const { Event } = require('gcommands');
const { hasThread } = require('../../structures/Utils');

class MessageCreate extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
            ws: false,
            once: false,
        });
    }

    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async run(_, message) {
        if (message.author.bot) return;
        const guild = this.client.guilds.cache.get(this.client.config.guildId);

        if (!message.inGuild()) {
            const thread = hasThread(guild, this.client.config.categoryId, message.author.id);
            if (thread) {
                thread.send(`**${message.author.tag}** ↠ ${message.content}`).catch(e => message.channel.send('\⭐ Your message is too long!'));
                return;
            } else {
                const category = guild.channels.cache.get(this.client.config.categoryId);
                const permissions = [...category.permissionOverwrites.cache.values()].map(p => {
                    return {
                        id: p.id,
                        allow: p.allow,
                        deny: p.deny,
                        type: p.type
                    }
                })
    
                await guild.channels.create(`${message.author.id}-thread`, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: permissions ?? [],
                    parent: category.id
                })
    
                message.channel.send('\⭐ Thank you for your message! Our mod team will reply to you here as soon as possible. Please keep in mind that **we are not Discord employees** and support issues have to go to https://dis.gd/support, and we cannot assist you or escalate them for you.')
                this.client.emit('messageCreate', message);
            }
        } else if (message.guildId === this.client.config.guildId) {
            if (message.channel.parentId !== this.client.config.categoryId && !message.channel.name.includes('thread')) return;

            const user = this.client.users.cache.get(message.channel.name.split('-')[0]);

            if (!user) return message.channel.send('\⭐ This user is not on the servers.')
            else user.send(`**${message.author.tag}** ↠ ${message.content}`).catch(e => message.channel.send('\⭐ Your message is too long!'))
        }
    }
}

module.exports = MessageCreate;
