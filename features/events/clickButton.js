const { MessageEmbed } = require("discord.js");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: "clickButton",
            once: false,
        })
    }

    async run(client, button) {
        if(button.customId.startsWith(`appAccept_`)) {
            let user = client.users.cache.get(button.customId.split("_")[1]);
            if(!user) return button.message.edit({content:"Left :(", components: []});

            let msgToEdit = button.message;
            msgToEdit.embeds[0]["color"] = "GREEN";
            msgToEdit.embeds[0]["footer"] = "Status: Accepted";

            button.message.edit({
                content: new MessageEmbed(msgToEdit.embeds[0]),
                components: []
            })

            user.send(`Your application accepted!`)
        }

        if(button.customId.startsWith(`appDenied_`)) {
            let user = client.users.cache.get(button.customId.split("_")[1]);
            if(!user) return button.message.edit({content:"Left :(", components: []});

            let msgToEdit = button.message;
            msgToEdit.embeds[0]["color"] = "RED";
            msgToEdit.embeds[0]["footer"] = "Status: Denied";

            button.message.edit({
                content: new MessageEmbed(msgToEdit),
                components: []
            })

            user.send(`Your application denied!`)
        }
    }
}
