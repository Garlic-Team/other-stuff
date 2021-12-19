class Utils {
    static hasThread(guild, category, id) {
        const channel = guild.channels.cache.find(ch => ch.name === `${id}-thread` && ch.parentId === category);
        return channel;
    }
}

module.exports = Utils;