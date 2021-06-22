const { MessageEmbed, MessageAttachment } = require("discord.js");
const {MessageButton, MessageActionRow} = require("gcommands")

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
    description: "app",
    expectedArgs: [
        {
            name: "request",
            type: 1,
            description: "request to app",
            options: [
                {
                    name: "role",
                    type: 8,
                    description: "role",
                    required: true
                }
            ]
        }
    ],
    guildOnly: "747526604116459691",
    run: async({client, member, respond}, array, args) => {
        if(array[0] == "request") {
            let questionCounter = 0;
            let endCounter = 0;

            const filter = async(msg) => msg.author.id == member.user.id

            const appStart = await member.user.send(`${questions[questionCounter++]}`).catch(e => { return respond({content:"Enable DMs.",ephemeral:true}) });
            const collector = appStart.channel.createMessageCollector(filter);

            respond({content:"Check DMs.",ephemeral:true})
            collector.on('collect', (message) => {
                if(questionCounter < questions.length) {
                    appStart.channel.send(questions[questionCounter++])
                } else {
                    appStart.channel.send("**Thanks for apply :)**")

                    collector.stop("succ")
                }
            })

            collector.on("end", (collected, reason) => {
                if(reason == "succ") {
                    let index = 1;
                    let quest = collected.map((msg) => `${index++}) ${questions[endCounter++]} -> \`${msg.content}\``).join("\n");

                    let embed = new MessageEmbed()
                    .setAuthor(collected.first().author.username, collected.first().author.avatarURL({dynamic:true}))
                    .setDescription(quest)

                    let accept = new MessageButton()
                        .setLabel("Accept")
                        .setStyle("green")
                        .setID(`appAccept_${collected.first().author.id}`)

                    let denied = new MessageButton()
                        .setLabel("Denied")
                        .setStyle("red")
                        .setID(`appDenied_${collected.first().author.id}`)
 

                    client.channels.cache.get("855733662268391424").send({
                        content: embed,
                        components: new MessageActionRow().addComponent(accept).addComponent(denied)
                    }).catch(e => {
                        client.channels.cache.get("855733662268391424").send({
                            attachments: new MessageAttachment(Buffer.from(quest), `quest_${collected.first().author.id}.txt`)
                        })
                    });
                }
            })
        }
    }
}
