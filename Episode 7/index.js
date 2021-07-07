require("dotenv").config();

const { Client } = require("discord.js")
const { GCommands } = require("gcommands");

const client = new Client();

client.on("ready", () => {
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

    setTimeout(() => { disabledCmdsCache(client.guilds.cache) }, 2000)

    client.dispatcher.addInhibitor((command, {member, guild, respond, edit}) => {
        let disabledCmds = guild.disabledCommands;
        if(!disabledCmds) return;

        if(disabledCmds.some(cmd => cmd.name == command.name)) {
            respond({
                content: "📌 This command is disabled :(",
                ephemeral: true
            });

            return false;
        }
    })
})

async function disabledCmdsCache(guilds) {
    guilds.forEach(async(guild) => {
        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}
        if(!guildInfo.disabledCommands || guildInfo.disabledCommands.length == 0) return;

        guild.disabledCommands = guildInfo.disabledCommands;
    })
}

client.login(process.env.token)