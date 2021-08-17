const { Command } = require("gcommands");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "parse",
            description: "parse user/message informations with context menus",
            guildOnly: "747526604116459691",
            slash: false
        })
    }

    async run({ respond }, _, args) {
        if(args.user) respond({ content: `Username: ${args.user.username}`, ephemeral: true })
        if(args.message) respond({ content: `Content: ${args.message.content}`, ephemeral: true })
    }
}