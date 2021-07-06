require("dotenv").config();

const { Client } = require("discord.js"),
    {GCommands} = require("gcommands")

const client = new Client();

client.on("ready", () => {
    const gc = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        language: "english",
        slash: {
            slash: false,
            prefix: "!"
        }
    })

    gc.on("log", console.log)
    gc.on("debug", console.log)
})

client.login(process.env.token)