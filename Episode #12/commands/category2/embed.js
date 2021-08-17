const { MessageEmbed } = require("discord.js")
const { MessageButton, MessageActionRow, Command } = require("gcommands") // using discord-buttons but edited!

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "embedbuilder",
            description: "Embed builder",
            guildOnly: "747526604116459691",
            category: "category2",
        })
    }

    async run({client, member, respond, edit}, args) {
        const embedToBuild = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL({dynamic:true}))

        let title = new MessageButton()
            .setLabel("Title")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_title`)

        let description = new MessageButton()
            .setLabel("Description")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_desc`)

        let footer = new MessageButton()
            .setLabel("Footer")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_footer`)

        let footerImage = new MessageButton()
            .setLabel("Footer Image")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_footerimg`)

        let image = new MessageButton()
            .setLabel("Image")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_img`)

        let thumbnail = new MessageButton()
            .setLabel("Thumbnail")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_thumb`)

        let timestamp = new MessageButton()
            .setLabel("Timestamp")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_timestamp`)

        let color = new MessageButton()
            .setLabel("Color")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_color`)

        let addfield = new MessageButton()
            .setLabel("Add Field")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_addfield`)

        let removefield = new MessageButton()
            .setLabel("Remove Field")
            .setStyle("blurple")
            .setCustomId(`buildEmbed_builder_removefield`)

        let save = new MessageButton()
            .setLabel("Save")
            .setStyle("green")
            .setCustomId(`buildEmbed_save`)

        let cancel = new MessageButton()
            .setLabel("Cancel")
            .setStyle("red")
            .setCustomId(`buildEmbed_cancel`)

        let buttonRow = new MessageActionRow()
            .addComponent(title).addComponent(description).addComponent(footer).addComponent(color).addComponent(timestamp)

        let buttonRow2 = new MessageActionRow()
            .addComponent(footerImage).addComponent(image).addComponent(thumbnail)
            .addComponent(addfield).addComponent(removefield)

        let buttonRow3 = new MessageActionRow().addComponent(save).addComponent(cancel)
        
        let msg = await respond({
            content: embedToBuild,
            components: [buttonRow, buttonRow2, buttonRow3]
        })

        let buttonEvent = async (button) => {
            if (button.message.id === msg.id) {
              if (button.clicker.user.id === member.id) {
                embedEditing(button);
              } else {
                button.defer();
              }
            };
        }

        client.on("clickButton", buttonEvent)

        let embedEditing = async(button) => {
            if(!button.customId.startsWith(`buildEmbed`) && button.message.id == msg.id) return;
            await button.defer();

            let id = button.customId.split(`buildEmbed_`)[1]
            if(id.startsWith(`builder`)) {
                let builderId = id.split(`builder_`)[1]
                let noInput = ["timestamp"]
                let noInputFinal = !noInput.some(a => a == builderId);
                let ifUrl = new RegExp('^(https?:\\/\\/)?'+
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?'+
                '(\\#[-a-z\\d_]*)?$','i');

                button.edit({
                    autoDefer: false,
                    content: `Waiting for input... ${builderId.includes("field") ? "(field name)" : ""}`,
                    inlineReply: false,
                    components: new MessageActionRow().addComponent(new MessageButton().setLabel("Cancel").setStyle("red").setCustomId(`buildEmbed_cancel`))
                })

                let input;
                if(noInputFinal) {
                    let filter = async(message) => button.clicker.user.id == message.author.id
                    input = await button.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(e => {
                        return client.emit(`clickButton`, {
                            id: `buildEmbed_cancel`,
                            message: button.message,
                            channel: button.channel
                        })
                    })
                }

                let finalInput = input ? input.first() : "";
                if(builderId == "title") embedToBuild.setTitle(finalInput.content)
                if(builderId == "desc") embedToBuild.setDescription(finalInput.content)
                if(builderId == "footer") embedToBuild.setFooter(finalInput.content)
                if(builderId == "color") {
                    if(!/^#[0-9A-F]{6}$/i.test(finalInput.content)) embedToBuild.setColor("RANDOM")
                    else embedToBuild.setColor(finalInput.content)
                }
                if(builderId == "footerimg") {
                    if(ifUrl.test(finalInput)) {
                        embedToBuild.setFooter(`${embedToBuild.footer ? embedToBuild.footer.text : "\u200B"}`, finalInput.content)
                    }
                }
                if(builderId == "img") {
                    if(ifUrl.test(finalInput)) {
                        embedToBuild.setImage(finalInput.content)
                    }
                }
                if(builderId == "thumb") {
                    if(ifUrl.test(finalInput)) {
                        embedToBuild.setThumbnail(finalInput.content)
                    }
                }
                if(builderId == "addfield") {
                    button.edit({
                        autoDefer: false,
                        content: `Waiting for input... ${builderId == "addfield" ? "(field value)" : ""}`,
                        inlineReply: false,
                        components: new MessageActionRow().addComponent(new MessageButton().setLabel("Cancel").setStyle("red").setCustomId(`buildEmbed_cancel`))
                    })

                    let fieldValue = await getFieldValue(button)
                    embedToBuild.addField(finalInput.content, fieldValue.content)

                    fieldValue.delete()
                }
                if(builderId == "removefield") {
                    let toRemove = embedToBuild.fields.find(f => f.name == finalInput.content);
                    let newFields = embedToBuild.fields.find(f => f.name != finalInput.content)
                    if(!newFields) newFields = [];

                    if(toRemove) embedToBuild.fields = newFields
                }
                if(builderId == "timestamp") embedToBuild.setTimestamp()

                button.edit({
                    autoDefer: false,
                    inlineReply: false,
                    content: embedToBuild,
                    components: [buttonRow, buttonRow2, buttonRow3]
                })
                finalInput.delete();
            }

            if(id == `cancel`) {
                button.edit({content:`Canceling...`,components:[], autoDefer: false}) 

                setTimeout(async() => {
                    let message = await button.channel.messages.fetch(button.message.id)
                    message.delete();
                }, 3000)

                await client.removeListener("clickButton", buttonEvent);
            }

            if(id == `save`) {
                let messageToDelete = await button.channel.messages.fetch(button.message.id);
                messageToDelete.delete();
                
                button.channel.send({content:embedToBuild,components:[], autoDefer: false,inlineReply: false}) 
                await client.removeListener("clickButton", buttonEvent);
            }

            setTimeout(() => {
                button.edit({content:embedToBuild,components:[],autoDefer: false,inlineReply: false})
                client.removeListener("clickButton", buttonEvent);
            }, 300000)
        }

        async function getFieldValue(button) {
            let input;
            let filter = async(message) => button.clicker.user.id == message.author.id
            input = await button.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(e => {
                return client.emit(`clickButton`, {
                    id: `buildEmbed_cancel`,
                    message: button.message,
                    channel: button.channel
                })
            })

            return input ? input.first() : "";
        }
    }
}