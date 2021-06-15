const { MessageButton, MessageActionRow } = require("gcommands") // using discord-buttons but edited!

module.exports = {
    name: "components",
    description: "Components",
    guildOnly: "833628077556367411",
    run: async({client, member, respond, edit}, args) => {
        let button = new MessageButton()
            .setLabel("hello")
            .setStyle("red")
            .setID("helloButton")

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