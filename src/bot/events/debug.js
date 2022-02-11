const { Listener } = require('gcommands');

class Debug extends Listener {
    constructor() {
        super({
            name: 'debug',
            event: 'debug',
            ws: false,
            once: false,
        });
    }

    run(debug) {
        console.log(debug);
    }
}

module.exports = Debug;
