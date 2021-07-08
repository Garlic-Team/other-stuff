const hash = require("murmurhash")

module.exports = {
    name: "experiments",
    description: "position",
    guildOnly: "747526604116459691",
    category: "category1",
    run: async({client, member, respond}) => {
        let position = hash.v3(`2021-05_custom_profiles_premium:${member.id}`) % 1e4

        respond(`Profile Banner/About Me **[BETA]**\n\nYour position is **\`${position}\`**`)
    }
}