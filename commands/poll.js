const { Command, CommandType } = require('gcommands');

new Command({
	name: 'poll',
	description: 'Create new poll!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
		return ctx.reply(`Hello ${ctx.user.username}!`);
	}
});