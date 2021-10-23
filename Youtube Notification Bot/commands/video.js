const { Command } = require('gcommands');
const config = require("../config.json")

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "video",
            description: "video",
            guildOnly: config.guildId
        })
    }

    async run({ client, respond }) {
        let req = (await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.youtubeChannelId}`)).items[0]
    
        respond({
            content: `${client.config.latestVideoMessage.replace("{url}", req.link)}`,
            ephemeral: true
        })
    }
}