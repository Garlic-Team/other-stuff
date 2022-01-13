const { GClient } = require('gcommands');
const { join } = require('path');

class ModMailClient extends GClient {
    constructor(options) {
        super(options);

        this.token = options.token;
        this.categories = null;
    }

    get config() {
        return require(join(__dirname, '../../../config.json'));
    }

    run() {
        this.login(this.token);
    }
}

module.exports = ModMailClient;