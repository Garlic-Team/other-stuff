require("dotenv").config();

const { GCommandsClient } = require("gcommands")

const client = new GCommandsClient(client, {
    cmdDir: __dirname + "/commands/",
    eventDir: __dirname + "/events/",
    language: "english",
    commands: {
        slash: "both",
        context: false,
        prefix: "!"
    }
})

client.on("debug", (debug) => console.log(debug))

client.on("ready", () => console.log('hello'))

client.login(process.env.token)
