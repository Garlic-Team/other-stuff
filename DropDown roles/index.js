require("dotenv").config();

const { GCommandsClient } = require("gcommands")

const client = new GCommandsClient({
    cmdDir: "commands/",
    eventDir: "events/",
    language: "english",
    commnads: {
        slash: false,
        context: false,
        prefix: "!"
    }
})

client.on("ready", () => { console.log("ready") })
client
    .on("log", console.log)
    .on("debug", console.log);

client.login(process.env.token)