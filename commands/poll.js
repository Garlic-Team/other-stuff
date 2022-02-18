const { Command, CommandType } = require('gcommands');

new Command({
	name: 'hello',
	description: 'Says hello!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
		return ctx.reply(`Hello ${ctx.user.username}!`);
	}
});