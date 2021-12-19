const { Client } = require('discord.js');
const { Event } = require('gcommands');

class Debug extends Event {
    constructor(client) {
        super(client, {
            name: 'debug',
            ws: false,
            once: false,
        });
    }

    /**
     * @param {Client} client 
     * @param {string} debug 
     */
    run(client, debug) {
        console.log(debug);
    }
}

module.exports = Debug;
