const { Message } = require('discord.js');
const { Listener } = require('gcommands');
const { hasThread } = require('../../structures/Utils');

new class MessageCreate extends Listener {
    constructor() {
        super({
            name: 'messageCreate',
            event: 'messageCreate'
        });
    }

    /**
     * @param {Message} message 
     */
    async run(message) {
        const client = message.client;

        if (message.author.bot) return;
        const guild = client.guilds.cache.get(client.config.guildId);

        if (!message.inGuild()) {
            const thread = hasThread(guild, client.config.categoryId, message.author.id);
            if (thread) {
                thread.send(`**${message.author.tag}** ↠ ${message.content}`).catch(e => message.channel.send('\⭐ Your message is too long!'));
                return;
            } else {
                const category = guild.channels.cache.get(client.config.categoryId);
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
                client.emit('messageCreate', message);
            }
        } else if (message.guildId === client.config.guildId) {
            if (message.channel.parentId !== client.config.categoryId && !message.channel.name.includes('thread')) return;

            const user = client.users.cache.get(message.channel.name.split('-')[0]);

            if (!user) return message.channel.send('\⭐ This user is not on the servers.')
            else user.send(`**${message.author.tag}** ↠ ${message.content}`).catch(e => message.channel.send('\⭐ Your message is too long!'))
        }
    }
}
