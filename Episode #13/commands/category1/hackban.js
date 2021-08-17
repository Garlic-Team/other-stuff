const { ArgumentType, Command } = require("gcommands")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "hackban",
            description: "ban",
            userRequiredPermissions: "BAN_MEMBERS",
            clientRequiredPermissions: "BAN_MEMBERS",
            guildOnly: "747526604116459691",
            category: "category1",
            args: [
                {
                    name: "member",
                    type: ArgumentType.USER,
                    description: "member",
                    required: true
                },
                {
                    name: "reason",
                    type: ArgumentType.STRING,
                    description: "reason",
                    required: false
                }
            ],
            context: false
        })
    }

    async({client, member, guild, respond}, args) {
        let userID = args[0];
        let user = guild.members.cache.get(parseInt(userID))

        if(!userID) return respond(`Please insert a valid user ID.`)
        if(!parseInt(userID)) return respond(`Please insert a valid user ID.`)

        if(userID == member.id) return respond("No... sorry")
        if(userID == client.user.id) return respond("No... sorry")

        if(user && guild.members.cache.get(userID).roles.highest.position >= member.roles.highest.position) return respond("Can't...")
        
        guild.members.ban(userID, { reason: args[1] ? args[1] : "No reason provided" }).catch(e => {
            return respond(`An error occurent: **${e}**`)
        })

        respond(`${user ? user.user.tag : userID} has been banned!`)
    }
}