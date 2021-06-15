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
        defaultCooldown: "3s"
    })

    gc.on("debug", (debug) => console.log(debug))
})

client.login(process.env.token)