const { Listener } = require('gcommands');

new class Ready extends Listener {
    constructor() {
        super({
            name: 'ready',
            event: 'ready',
            ws: false,
            once: true,
        });
    }

    async run(client) {
        client.logChannel = await client.channels.fetch(client.config.logChannelId);
        
        let users = 0;
        for (let guild of [...client.guilds.cache.values()]) users += guild.memberCount;

        console.log([
            `${client.user.tag} is ready!`,
            ``,
            `Servers: ${client.guilds.cache.size}`,
            `Users: ${users}`,
        ].join('\n'));
    }
}
