const { Command } = require("gcommands")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: "pong",
            guildOnly: "747526604116459691",
            category: "category1",
            premium: true,
            context: false
        })
    }
    async run({client, respond, edit}, args) {
        respond("pong!")
    }
}