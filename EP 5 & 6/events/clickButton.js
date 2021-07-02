const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "clickButton",
    once: false,
    run: async(client, button) => {
        if(button.id.startsWith(`accept_`)) {
            let user = client.users.cache.get(button.id.split("_")[1]);
            if(!user) return button.edit({content:"Left :(", components: []});

            let msgToEdit = await button.channel.messages.fetch(button.message.id);
            msgToEdit.embeds[0]["color"] = "GREEN";
            msgToEdit.embeds[0]["footer"] = "Status: Accepted";

            button.edit({
                content: new MessageEmbed(msgToEdit.embeds[0]),
                components: []
            })

            user.send(`Your application accepted!`)
        }

        if(button.id.startsWith(`deny_`)) {
            let user = client.users.cache.get(button.id.split("_")[1]);
            if(!user) return button.edit({content:"Left :(", components: []});

            let msgToEdit = await button.channel.messages.fetch(button.message.id);
            msgToEdit.embeds[0]["color"] = "RED";
            msgToEdit.embeds[0]["footer"] = "Status: Denied";

            button.edit({
                content: new MessageEmbed(msgToEdit),
                components: []
            })

            user.send(`Your application denied!`)
        }
    }
}
