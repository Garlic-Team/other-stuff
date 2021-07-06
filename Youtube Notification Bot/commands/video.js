const { SlashCommand } = require("gcommands"),
    config = require("../config.json")

module.exports = (async () => {
    return {
        name: "video",
        description: "video",
        guildOnly: config.guildId,
        run: async({client, respond}, args) => {
            let req = (await client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.youtubeChannelId}`)).items[0]
    
            respond({
                content: `${client.config.latestVideoMessage.replace("{url}", req.link)}`,
                ephemeral: true
            })
        }
    }
})();