const hash = require("murmurhash")
const { Command } = require("gcommands");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "experiments",
            description: "position",
            guildOnly: "747526604116459691",
            category: "category1",
            context: false
        })
    }
    
    async run({client, member, respond}) {
        let position = hash.v3(`2021-05_custom_profiles_premium:${member.id}`) % 1e4

        respond(`Profile Banner/About Me **[BETA]**\n\nYour position is **\`${position}\`**`)
    }
}