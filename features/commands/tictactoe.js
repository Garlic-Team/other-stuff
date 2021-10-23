const { MessageButton, MessageActionRow } = require("gcommands/src")

module.exports = {
    name: "tictactoe",
    description: "tictactoe",
    guildOnly: "747526604116459691",
    args: [{
        name: "member",
        type: 6,
        description: "member"
    }],
    run: async({client, member, respond, edit}, args) => {
        let isOpponent = false;
        let fighters = undefined;

        let opponent = args.length != 0 ? client.users.cache.get(args[0]) : client
        if(opponent.id != client.id) {
            isOpponent = true
            fighters = [member.id, opponent.id]
        } else fighters = [member.id, client.user.id]

        let nextIs = 0;
        let allButtons = [
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_1"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_2"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_3"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_4"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_5"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_6"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_7"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_8"),
            new MessageButton().setLabel("➖").setStyle("gray").setID("tictactoe_9")
        ]

        let msgToCollect = await respond({
            content: `**TicTacToe** | <@!${fighters[nextIs]}>'s turn (${nextIs == 0 ? "⭕" : "❌"})`,
            components: parseButtons()
        })
        
        //const filter = async(btn) => btn.clicker.user.id == member.id
        //const collector = msgToCollect.createButtonCollector(filter)

        let tictactoe = async(message) => {
            if(!isOpponent) {
                const filter = async(btn) => btn.clicker.user.id == member.id
                const collector = message.createButtonCollector(filter)

                collector.on("collect", async(button) => {
                    var ifWinner = await ifWinnerF(button);
                    if(ifWinner.win) return edit({content: `${ifWinner.winner ? "Winner is <@" +  ifWinner.winner + ">" : ifWinner.reason}`, components: []})
        
                    await turn(button);
                    await clientTurn(button);
                })
            } else {
                edit({content: `**TicTacToe** | <@!${fighters[nextIs]}>'s turn (${nextIs == 0 ? "⭕" : "❌"})`, components: parseButtons()})

                const filter = async(btn) => btn.clicker.user.id == fighters[nextIs]
                const collector = message.createButtonCollector(filter, { max: 1, time: 30000 })

                collector.on("collect", async(button) => {
                    turn(button, message)
                })

                collector.on('end', collected => {
                    if (collected.size == 0) edit(`<@!${fighters[nextIs]}> didn\'t react in time! (30s)`)
                });
            }
        }
        tictactoe(msgToCollect)

        let turn = async(button, message) => {
            await button.defer().catch(e => {});

            let buttonToEdit = allButtons.find(btn => btn.custom_id == button.id)

            buttonToEdit["label"] = `${nextIs == 0 ? "⭕" : "❌"}`
            buttonToEdit["disabled"] = true;
            buttonToEdit["style"] = nextIs == 0 ? 3 : 4

            if(!isOpponent) allButtons.forEach(btn => btn.disabled = true)
            else {
                allButtons.forEach(btn => {
                    if(btn.label == "➖") btn.disabled = false
                    if(btn.label == "❌" || btn.label == "⭕") btn.disabled = true;
                })
            }

            var ifWinner = await ifWinnerF(button);
            if(ifWinner.win) return edit({content: `${ifWinner.winner ? "Winner is <@" +  ifWinner.winner + ">" : ifWinner.reason}`, components: []})

            if(nextIs == 0) nextIs = 1
            else if(nextIs = 1) nextIs = 0

            if(isOpponent) tictactoe(message)
            if(!isOpponent) {
                button.edit({
                    autoDefer: false,
                    content: `**TicTacToe** | <@!${client.user.id}>'s turn (⭕)`,
                    components: parseButtons()
                })
            }
        }

        let clientTurn = async(button) => {
            setTimeout(() => {
                let canButton = findAllButtons(allButtons, "➖")

                let buttonToEdit = canButton[Math.floor(Math.random() * (canButton.length - 1) + 1)]
    
                allButtons.forEach(btn => {
                    if(btn.label == "➖") btn.disabled = false
                    if(btn.label == "❌" || btn.label == "⭕") btn.disabled = true;
                })
    
                buttonToEdit["label"] = "❌"
                buttonToEdit["disabled"] = true;
                buttonToEdit["style"] = 4

                button.edit({
                    autoDefer: false,
                    content: `**TicTacToe** | <@!${button.clicker.user.id}>'s turn (⭕)`,
                    components: parseButtons()
                })
            }, 2500)

            nextIs = 0;
        }

        // Utils 
        function ifWinnerF(button) {
            let btn = allButtons;

            let ifAllDisabled = allButtons.every(b => b.disabled == true)
            if(ifAllDisabled) return { win: true, winner: null, reason: `Nobody won.` }

            if(btn[0].label == "⭕" && btn[1].label == "⭕" && btn[2].label == "⭕") return { win: true, winner: fighters[nextIs] };
            if(btn[3].label == "⭕" && btn[4].label == "⭕" && btn[5].label == "⭕") return { win: true, winner: fighters[nextIs] };
            if(btn[6].label == "⭕" && btn[7].label == "⭕" && btn[8].label == "⭕") return { win: true, winner: fighters[nextIs] };

            if(btn[0].label == "⭕" && btn[3].label == "⭕" && btn[6].label == "⭕") return { win: true, winner: fighters[nextIs] };
            if(btn[1].label == "⭕" && btn[4].label == "⭕" && btn[7].label == "⭕") return { win: true, winner: fighters[nextIs] };
            if(btn[2].label == "⭕" && btn[5].label == "⭕" && btn[8].label == "⭕") return { win: true, winner: fighters[nextIs] };

            if(btn[0].label == "⭕" && btn[4].label == "⭕" && btn[8].label == "⭕") return { win: true, winner: fighters[nextIs] };
            if(btn[2].label == "⭕" && btn[4].label == "⭕" && btn[6].label == "⭕") return { win: true, winner: fighters[nextIs] };


            if(btn[0].label == "❌" && btn[1].label == "❌" && btn[2].label == "❌") return { win: true, winner: fighters[nextIs] };
            if(btn[3].label == "❌" && btn[4].label == "❌" && btn[5].label == "❌") return { win: true, winner: fighters[nextIs] };
            if(btn[6].label == "❌" && btn[7].label == "❌" && btn[8].label == "❌") return { win: true, winner: fighters[nextIs] };

            if(btn[0].label == "❌" && btn[3].label == "❌" && btn[6].label == "❌") return { win: true, winner: fighters[nextIs] };
            if(btn[1].label == "❌" && btn[4].label == "❌" && btn[7].label == "❌") return { win: true, winner: fighters[nextIs] };
            if(btn[2].label == "❌" && btn[5].label == "❌" && btn[8].label == "❌") return { win: true, winner: fighters[nextIs] };

            if(btn[0].label == "❌" && btn[4].label == "❌" && btn[8].label == "❌") return { win: true, winner: fighters[nextIs] };
            if(btn[2].label == "❌" && btn[4].label == "❌" && btn[6].label == "❌") return { win: true, winner: fighters[nextIs] };

            return { win: false }
        }

        function findAllButtons (arr, val) {
            var indexes = [], i;
            for(i = 0; i < arr.length; i++)
                if (arr[i].label === val)
                    indexes.push(arr[i]);
            return indexes;
        }

        function parseButtons() {
            let finalButtons = [];

            for(let i = 0; true; i += 3) {
                if (i >= allButtons.length) break;
    
                let btns = allButtons.slice(i, i + 3);
                let actionRow = new MessageActionRow();
            
                for (let x = 0; x < btns.length; x++) {
                    actionRow.addComponent(btns[x]);
                }
    
                finalButtons.push(actionRow)
            }

            return finalButtons;
        }
    }
}
