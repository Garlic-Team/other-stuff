const { MessageButton, MessageActionRow } = require("discord-buttons")

module.exports = {
    name: "ping",
    description: "pong",
    guildOnly: "747526604116459691",
    run: async({client, respond, edit}, args) => {
        let button = new MessageButton().setLabel("a").setStyle("green").setID("a")
        let a = new MessageActionRow().addComponent(button)
        respond({
            content: "a",
            components: a
        })
    }
}