const express = require('express')();
express.get('/', (req, res) => res.send('<!-- auto-pinging 525316393768452098 -->'))
express.listen(3000);

const mineflayer = require('mineflayer');
const sleep = require('util').promisify(setTimeout);

const startBot = () => {
    const bot = mineflayer.createBot({
        host: process.env.IP,
        username: 'Uptimer'
    })

    bot.on('login', async() => {
        console.log('Joined!');

        await sleep(10000);

        bot.end();
    })

    bot.on('kicked', () => startBot());
    bot.on('error', () => startBot());
}

setInterval(() => {
    startBot();
}, 30000)

startBot();
