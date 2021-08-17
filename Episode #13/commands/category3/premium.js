const { ArgumentType, Command } = require("gcommands")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "premium",
            description: "premium command",
            args: [
                {
                    name: "guild",
                    description: "guild id",
                    type: ArgumentType.STRING,
                    required: true
                }
            ],
            guildOnly: "747526604116459691",
            userOnly: "525316393768452098",
            category: "category3",
            context: false
        })
    }

    async run({respond, client}, args) {
        let premiumGuild = client.guilds.cache.get(args[0]);
        if(!premiumGuild) return respond({content: "Invalid guild Id", ephemeral: true})

        let guildInfo = client.database.get(`guild_${premiumGuild.id}`) || {}

        if(premiumGuild.premium) {
            delete guildInfo.premium;
            delete premiumGuild.premium;

            respond({content: "Removed premium for guild", ephemeral: true})
        } else {
            guildInfo.premium = true;
            premiumGuild.premium = true;

            respond({content: "Added premium for guild", ephemeral: true})
        }

        client.database.set(`guild_${premiumGuild.id}`, guildInfo);
    }
}