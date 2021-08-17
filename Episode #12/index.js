require("dotenv").config();

const { Intents } = require("discord.js")
const { GCommandsClient } = require("gcommands");

const client = new GCommandsClient({
    cmdDir: "commands/",
    eventDir: "events/",
    language: "english",
    commands: {
        slash: "both",
        context: "false",
        prefix: "!"
    },
    defaultCooldown: "3s",
    database: process.env.db,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES]
})

client.on("ready", () => {
    client.supporterRole = client.guilds.cache.get("747526604116459691").roles.cache.get("862746972616523776");

    setTimeout(() => { disabledCmdsAndPremiumCache(client.guilds.cache) }, 2000)

    client.dispatcher.addInhibitor(async(interaction, {member, guild, respond, edit}) => {
        if(!(await interaction.isCommand())) return;
        
        let disabledCmds = guild.disabledCommands;
        let premium = guild.premium;

        if(disabledCmds && disabledCmds.some(cmd => cmd.name == command.name)) {
            respond({
                content: "📌 This command is disabled :(",
                ephemeral: true
            });

            return false;
        }

        if(interaction.premium && !premium) {
            respond({
                content: "🎈 Only for premium",
                ephemeral: true
            })
            return false;
        }
    })
})

client
    .on("log", console.log)
    .on("debug", console.log);

async function disabledCmdsAndPremiumCache(guilds) {
    guilds.forEach(async(guild) => {
        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}
        if(guildInfo.disabledCommands && guildInfo.disabledCommands.length != 0) guild.disabledCommands = guildInfo.disabledCommands;
        if(guildInfo.premium) guild.premium = guildInfo.premium;
    })
}

client.login(process.env.token)