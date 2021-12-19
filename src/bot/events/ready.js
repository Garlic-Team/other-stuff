const { Client } = require('discord.js');
const { Event } = require('gcommands');

class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            ws: false,
            once: true,
        });
    }

    /**
     * @param {Client} client 
     */
    run(client) {
        let users = 0;
        for (let guild of [...client.guilds.cache.values()]) users += guild.memberCount;

        console.log([
            `${client.user.tag} is ready!`,
            ``,
            `Servers: ${client.guilds.cache.size}`,
            `Users: ${users}`,
        ].join('\n'));

        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: 'Message me for help!',
                    type: 'PLAYING'
                }
            ]
        })
    }
}

module.exports = Ready;
