module.exports = {
    name: "selectMenu",
    once: false,
    run: async(client, menu) => {
        let menuId = menu.id

        if(menuId.startsWith(`selectRoles_`)) {
            let panel = menuId.split("_")[1]

            if(panel == "color") {
                let colorRole = String(menu.values[0]).split(":")[1], colorRoleFinal = colorRole.charAt(0).toUpperCase() + colorRole.slice(1);

                let role = menu.guild.roles.cache.find(r => r.name == colorRoleFinal)
                if(role) {
                    if(menu.clicker.member.roles.cache.find(r => r.name == colorRoleFinal)) {
                        menu.clicker.member.roles.remove(role)
                        menu.reply.send({
                            content: `Removed ${colorRoleFinal}`,
                            ephemeral: true
                        })
                    } else {
                        menu.clicker.member.roles.add(role)
                        menu.reply.send({
                            content: `Added ${colorRoleFinal}`,
                            ephemeral: true
                        })
                    }
                } else {
                    menu.defer();
                    return;
                }
            }
        }
    }
}