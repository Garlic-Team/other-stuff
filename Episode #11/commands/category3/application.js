const { MessageSelectMenu, MessageSelectMenuOption, MessageActionRow, MessageButton } = require("gcommands")
const { MessageEmbed, MessageAttachment } = require("discord.js")

let questions = [
    "**Why do you want to take this role**",
    "**What will you help with**",
    "**How much time will you be able to give us**",
    "**Which programming languages do you know**",
    "**Which languages do you know**",
    "**How old are you**"
]

module.exports = {
    name: "application",
    description: "select role",
    guildOnly: "747526604116459691",
    category: "category3",
    run: async({client, respond, edit, member}) => {
        let questionCounter = 0;
        let endCounter = 0;

        const dropdown = new MessageSelectMenu()
            .setID("app_dropdown")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Select role")
            .addOptions([
                new MessageSelectMenuOption().setLabel("Admin").setValue("appRole_Admin").setDescription("Has full perms").setEmoji("🧑‍💼"),
                new MessageSelectMenuOption().setLabel("Moderator").setValue("appRole_Moderator").setDescription("Has ban/kick members perms").setEmoji("🔨"),
                new MessageSelectMenuOption().setLabel("Helper").setValue("appRole_Helper").setDescription("Has warn perms").setEmoji("👀")
            ])

        let message = await respond({
            content: "Select role to apply.",
            components: [new MessageActionRow().addComponent(dropdown)]
        })
        console.log(message)

        const filter = async(menu) => menu.clicker.user.id == member.user.id
        const collector = message.createSelectMenuCollector(filter, { max: 1, time: 60000 })

        collector.on("collect", async(menu) => {
            await menu.defer();
            await menu.edit({
                content: "Check DMs."
            })

            let msgToDelete = menu.channel.messages.cache.get(menu.message.id)
            msgToDelete.delete({timeout: 3000})

            const authorFilter = async(msg) => msg.author.id == menu.clicker.user.id;
            const appStart = await menu.clicker.member.send(questions[questionCounter++]).catch(e => { return menu.reply.send({ content: "Enable DMs.", ephemeral: true}) })
            const authorCollector = appStart.channel.createMessageCollector(authorFilter)

            authorCollector.on("collect", (message) => {
                if(questionCounter < questions.length) {
                    appStart.channel.send(questions[questionCounter++])
                } else {
                    appStart.channel.send("**Thanks for apply :)**")

                    authorCollector.stop("succ")
                }
            })

            authorCollector.on("end", (collected, reason) => {
                if(reason == "succ") {
                    let index = 1;
                    let quest = collected.map((msg) => `${index++}) ${questions[endCounter++]} -> \`${msg.content}\``).join("\n");

                    let embed = new MessageEmbed()
                        .setAuthor(collected.first().author.username, collected.first().author.avatarURL({dynamic: true}))
                        .setDescription(`**Role**: ${String(menu.valueId).split("_")[1]}\n\n${quest}`)

                    let accept = new MessageButton()
                        .setLabel("Accept")
                        .setStyle("green")
                        .setID(`accept_${collected.first().author.id}`)

                    let deny = new MessageButton()
                        .setLabel("Deny")
                        .setStyle("red")
                        .setID(`deny_${collected.first().author.id}`)

                    client.channels.cache.get("855733662268391424").send({
                        content: embed,
                        components: new MessageActionRow().addComponents([accept, deny])
                    }).catch(e => {
                        client.channels.cache.get("855733662268391424").send({
                            attachments: new MessageAttachment(Buffer.from(`**Role:** ${String(menu.valueId).split("_")[1]}\n\n${quest}`), `app_${collected.first().author.id}.txt`)
                        })
                    })
                }
            })
        })

        collector.on("end", (collected, reason) => {
            if(collected.size == 0) return edit({content: "Time :(", components: []})
        })
    }
}