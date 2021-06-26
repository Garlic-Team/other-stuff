require("dotenv").config();

const { Client } = require("discord.js")
const { GCommands } = require("gcommands")

const client = new Client();

client.on("ready", () => {
   const gc = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        language: "english",
        slash: {
            slash: "both",
            prefix: "!"
        },
        defaultCooldown: "3s",
        database: process.env.database
        /* DB SUPPORT
         * redis://user:pass@localhost:6379
         * mongodb://user:pass@localhost:27017/dbname
         * sqlite://path/to/database.sqlite
         * postgresql://user:pass@localhost:5432/dbname
         * mysql://user:pass@localhost:3306/dbname
        */
    })

    setTimeout(() => { disabledCmdsCache(client.guilds.cache) }, 2000)

    gc.on("debug", (debug) => console.log(debug))
    gc.on("log", (log) => console.log(log))

    client.dispatcher.addInhibitor(async(command, {member, guild, respond}) => {
        let disabledCmds = guild.disabledCommands;
        if(!disabledCmds) return;

        if(disabledCmds.some(cmd => cmd.name == command.name)) {
            respond({
                content: "This command is disabled :(",
                ephemeral: true
            })

            return false;
        }
    })
})

async function disabledCmdsCache(guilds) {
    guilds.forEach(async(guild) => {
        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}
        if(!guildInfo.disabledCommands || guildInfo.disabledCommands.length == 0) guild.disabledCommands = [];

        guild.disabledCommands = guildInfo.disabledCommands;
    })
}

client.login(process.env.token)