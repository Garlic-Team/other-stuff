const { MessageButton, MessageActionRow, Command } = require("gcommands") // using discord-buttons but edited!

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "components",
            description: "Components",
            guildOnly: "747526604116459691",
            category: "category2",
        })
    }

    async run({client, member, respond, edit}, args) {
        let button = new MessageButton()
            .setLabel("hello")
            .setStyle("red")
            .setCustomId("helloButton")

        let buttonRow = new MessageActionRow()
            .addComponent(button)
        
        let msg = await respond({
            content: "HELLO!!",
            components: buttonRow
        })

        let filter = async(button) => button.clicker.user.id == member.user.id
        let collector = msg.createButtonCollector(filter, {max:1, time:60000})

        collector.on("collect", (b) => {
            b.edit("Goodbye")
        })
    }
}