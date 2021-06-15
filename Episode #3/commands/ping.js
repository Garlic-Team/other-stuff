module.exports = {
    name: "ping",
    description: "pong",
    guildOnly: "833628077556367411",
    run: async({client, respond, edit}, args) => {
        respond("pong!")
    }
}