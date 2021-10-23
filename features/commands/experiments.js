const hash = require("murmurhash")

module.exports = {
    name: "experiments",
    description: "position",
    guildOnly: "833628077556367411",
    args: [{
      name: "member",
      type: 6,
      description: "member"
    }],
    run: async({client, member, guild, respond}, args) => {
        let argMember = args.length != 0 ? guild.members.cache.get(args[0]) : member
        if(!argMember) argMember = {
          id: args[0],
          user: {
            tag: args[0]
          }
        }

        let bannerColorPicker = hash.v3(`2021-06_banner_color_picker:${argMember.id}`) % 1e4

        let perGuildAvatars = hash.v3(`2021-05_per_guild_avatars:${argMember.id}`) % 1e4

        let messageLimit = hash.v3(`2021-05_premium_increased_content_length:${argMember.id}`) % 1e4

        //respond(`Profile Banner/About Me **[BETA]**\n\n${argMember} position is **\`${position}\`**`)

        respond([
          `**${argMember.user.tag}** info`,
          ``,
          `**\`Custom Profiles Premium\`** - \`Restart/update discord on pc if you dont have.\``,
          `**\`Banner Color Picker\`** - \`${bannerColorPicker}\` from \`unkown\` per week`,
          `**\`Per Guild Avatars\`** - \`${perGuildAvatars}\` from \`500/1900\` per week`,
          `**\`Increased Message Limit\`** - \`${messageLimit}\` from \`unkown\` per week`,
        ].join("\n"))
    }
}
