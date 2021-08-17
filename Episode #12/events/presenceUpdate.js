module.exports = {
    name: "presenceUpdate",
    once: false,
    run: async(client, oldPresence, presence) => {
        if(!presence || !presence.member || (typeof presence.activities != "object")) return;

        let member = presence.member;
        let role = client.supporterRole;
        let statuses = ["discord.gg/garlic","discord.gg/thedevs"]
        let status = presence.activities.find(a => a.type == "CUSTOM");
        if(!Array.isArray(status) && typeof status != "array") return;

        if(!Object.keys(status).includes("state") || (statuses.some(s => !status.state.includes(s)))) {
            if(member._roles.includes("862746972616523776")) return member.roles.remove(role);
        }

        if(statuses.some(s => status.state.includes(s))) {
            if(!member._roles.includes("862746972616523776")) member.roles.add(role)
        }
    }
}
