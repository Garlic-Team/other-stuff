const { MessageButton, MessageActionRow } = require("gcommands")

module.exports = {
    name: "hack",
    description: "hack",
    guildOnly: "747526604116459691",
    args: [{
        name: "member",
        type: 6,
        description: "member"
    }],
    run: async({client, member, guild, respond, edit}, args) => {
        let hackedMember = args.length != 0 ? guild.members.cache.get(args[0]) : member;

        let hackedMesasges = [
            `Hacking ${hackedMember.user.username} now...`,
            `[▖] Finding discord login... (2fa bypassed)`,

            `[▘] Found:
        Email: ${hackedMember.user.username + hackedMember.id.slice(13)}@gmail.com
        Token: ${Buffer.from(hackedMember.id + hackedMember.id.slice(6)).toString("base64")}`,

            `[▖] Injecting trojan virus into discriminator #${hackedMember.user.discriminator}`,
            `[▘] Finding IP address`,
            `[▝] IP address: 127.0.0.1:${Math.floor(Math.random() * 999) + 100}`,
            `[▗] Reporting account to discord for breaking ToS...`
        ]

        let count = 0;

        await respond(hackedMesasges[count++])

        let interval = setInterval(() => {
            if(count == hackedMesasges.length) {
                edit(`[▖] Finished hacking ${hackedMember.user.username}`)
                clearInterval(interval)
                return;
            }

            edit(hackedMesasges[count++])
        }, 3000);
    }
};
