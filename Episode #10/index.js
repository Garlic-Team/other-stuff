require("dotenv").config();

const { Client } = require("discord.js")
const { GCommands } = require("gcommands");

const client = new Client();

client.on("ready", () => {
    client.supporterRole = client.guilds.cache.get("747526604116459691").roles.cache.get("862746972616523776");
    
   const g = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        language: "english",
        slash: {
            slash: "both",
            prefix: "!"
        },
        defaultCooldown: "3s",
        database: process.env.db
    })

    g.on("log", (log) => console.log(log))
    g.on("debug", (debug) => console.log(debug))

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

async function disabledCmdsAndPremiumCache(guilds) {
    guilds.forEach(async(guild) => {
        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}
        if(guildInfo.disabledCommands && guildInfo.disabledCommands.length != 0) guild.disabledCommands = guildInfo.disabledCommands;
        if(guildInfo.premium) guild.premium = guildInfo.premium;
    })
}

client.login(process.env.token)