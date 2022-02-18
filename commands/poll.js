const { MessageEmbed } = require('discord.js');
const { Command, CommandType, Argument, ArgumentType } = require('gcommands');

new Command({
    name: 'userinfo',
    description: 'Check user informations',
    type: [ CommandType.SLASH ],
    arguments: [
        new Argument({
            name: 'Poll',
            description: 'Select user',
            type: ArgumentType.USER,
            required: true,
        })
    ],
    run: (ctx) => {
        // We will use the getMember method because we want to get a straight GuildMember from the argument.
        // We'll put `user` in this method because that's what our argument is called.
        const member = ctx.arguments.getMember('user');

        const embed = new MessageEmbed()
            .setAuthor({
                name: member.user.tag.toString(),
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
            })
            .addFields([
                {
                    name: 'Username',
                    value: member.user.username.toString(),
                    inline: true,
                },
                {
                    name: 'Discriminator',
                    value: member.user.discriminator.toString(),
                    inline: true,
                },
                {
                    name: 'Nickname',
                    value: member.nickname || 'none',
                    inline: true,
                },
                {
                    name: 'Joined At',
                    value: member.joinedAt.toString(),
                    inline: true,
                },
                {
                    name: 'Created At',
                    value: member.user.createdAt.toString(),
                    inline: true,
                }
            ])
            .setColor(member.displayHexColor || "RANDOM")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        ctx.reply({
            content: `Informations about ${member.toString()}`,
            embeds: [ embed ],
        })
    }
})