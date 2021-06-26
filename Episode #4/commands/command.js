module.exports = {
    name: "command",
    description: "disable/enable cmd",
    guildOnly: "747526604116459691",
    userRequiredPermissions: "MANAGE_GUILD",
    expectedArgs: [
        {
            name: "enable",
            type: 1,
            description: "enable",
            options: [
                {
                    name: "command",
                    type: 3,
                    description: "cmd",
                    required: true
                }
            ]
        },
        {
            name: "disable",
            type: 1,
            description: "disable",
            options: [
                {
                    name: "command",
                    type: 3,
                    description: "cmd",
                    required: true
                }
            ]
        }
    ],
    run: async({client, member, guild, respond}, args) => {
        let command = client.commands.get(args[1])
        if(!command) return respond({content: `Cmd doesn't exist!`, ephemeral: true})

        let guildInfo = await client.database.get(`guild_${guild.id}`) || {}
        console.log(guildInfo)
        if(!guildInfo.disabledCommands) guildInfo.disabledCommands = [];


        if(args[0] == "disable") {
            if(!guildInfo.disabledCommands.some(cmd => cmd.name == command.name)) guildInfo.disabledCommands.push(command);
            else return respond({content: "Cmd is already disabled."})
        }

        if(args[0] == "enable") {
            if(!guildInfo.disabledCommands.some(cmd => cmd.name == command.name)) return respond({content: "Cmd is not disabled."}) 
            else {
                guildInfo.disabledCommands = guildInfo.disabledCommands.filter(cmd => cmd.name != command.name);
            }
        }

        client.database.set(`guild_${guild.id}`, guildInfo)

        respond(`Success!`)

        guild.disabledCommands = guildInfo.disabledCommands;
    }
}