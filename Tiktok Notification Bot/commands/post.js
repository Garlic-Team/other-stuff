const { SlashCommand } = require("gcommands"),
    config = require("../config.json")

module.exports = (async () => {
    return {
        name: "post",
        description: "post",
        guildOnly: config.guildId,
        run: async({client, respond}, args) => {
            const { collector: newPosts } = client.tiktokUser;
    
            respond({
                content: `${client.config.latestPostMessage.replace("{url}", newPosts[0].webVideoUrl)}`,
                ephemeral: true
            })
        }
    }
})();