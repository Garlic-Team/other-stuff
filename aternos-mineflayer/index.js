const mineflayer = require('mineflayer');
const sleep = require('util').promisify(setTimeout);

const startBot = () => {
    const bot = mineflayer.createBot({
        host: 'xHyroMLolVideo.aternos.me',
        username: 'Uptimer'
    })

    bot.on('login', async() => {
        console.log('Joined!')

        await sleep(5000);
        
        bot.end();
    })

    bot.on('kicked', console.log)
    bot.on('error', console.log)
}

setTimeout(() => {
    startBot()
}, 30000)

startBot();