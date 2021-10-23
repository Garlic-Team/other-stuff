const { Command } = require('gcommands');
const config = require("../config.json")

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "post",
            description: "post",
            guildOnly: config.guildId
        })
    }

    async run({ client, respond }) {
        const { collector: newPosts } = client.tiktokUser;

        respond({
            content: `${client.config.latestPostMessage.replace("{url}", newPosts[0].webVideoUrl)}`,
            ephemeral: true
        })
    }
}