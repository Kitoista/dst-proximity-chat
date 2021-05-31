const { Message, Base } = require("discord.js");
const Game = require("./game.js");

class TicTacToe extends Game {

    constructor(bot, msg, params) {
        super(bot, msg, params);
        this.name = "TicTacToe";
        this.board = null;
        this.collector = null;
        // this.reactions = ['1⃣'];
        this.reactions = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
        this.playerReactions = [':x:', ':o:'];
        this.currentPlayer = 0;
        this.start(msg, params);
    }

    async start(msg, params) {
        this.running = true;
        await msg.reply("let's FUCKING GOOO");
        let text = '';
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                text += this.reactions[i * 3 + j];
            }
            text += '\n';
        }
        this.board = await msg.channel.send(text);
        for (let i = 0; i < this.reactions.length; ++i) {
            await this.board.react(this.reactions[i]);
        }
        const filter = (reaction, user) => {
            return this.reactions.includes(reaction.emoji.name) // && this.playerIds.includes(user.id);
        }
        this.collector = this.board.createReactionCollector(filter);
        this.collector.on('collect', async r => {
            const newText = this.board.content.replace(r.emoji.name, this.playerReactions[this.currentPlayer]);
            this.currentPlayer = 1 - this.currentPlayer;
            this.board = await this.board.edit(newText);
        })
    }

    async stop(msg, params) {
        this.running = false;
        msg.reply("Ok bye~ *fades away with Anna's voice*");
    }

    async handle(msg, params) {
        msg.reply("This was an extra request ;)");
    }

}

module.exports = TicTacToe;