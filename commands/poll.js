const { Command, CommandType } = require('gcommands');

new Command({
	name: 'hello',
	description: 'Says hello!',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	// The function thats executed when the user uses the command.
	run: (ctx) => {
		return ctx.reply(`Hello ${ctx.user.username}!`);
	}
});