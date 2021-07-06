const { MessageSelectMenu, MessageSelectMenuOption, MessageActionRow } = require("gcommands")

module.exports = {
    name: "setup",
    description: "roles setup",
    userRequiredPermissions: "MANAGE_GUILD",
    run: async({client, respond}) => {
        const dropdown = new MessageSelectMenu()
            .setID(`selectRoles_color`)
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Select color roles")
            .addOptions([
                new MessageSelectMenuOption().setDescription("Red").setEmoji("🔴").setLabel("Red").setValue(`selectRoles_color:Red`),
                new MessageSelectMenuOption().setDescription("Blue").setEmoji("🔵").setLabel("Blue").setValue(`selectRoles_color:Blue`),
                new MessageSelectMenuOption().setDescription("Green").setEmoji("🟢").setLabel("Green").setValue(`selectRoles_color:Green`)
            ])

        respond({
            content: "Select color roles :D",
            components: [new MessageActionRow().addComponent(dropdown)]
        })
    }
}