const { Message } = require("discord.js");

class Game {

    constructor(bot, msg, params) {
        this.bot = bot;
        this.name = "Game";
        this.running = false;
        this.playerIds = [];
        this.players = [];

        this.owner = msg.author;
        msg.reply("Created game " + msg.author.id);
    }

    async join(msg, params) {
        let index = this.playerIds.indexOf(msg.author.id);
        if (index === -1) {
            this.playerIds.push(msg.author.id);
            this.players.push(msg.author);
            msg.reply("Joined to " + this.name);
        } else {
            msg.reply("You are already part of this " + this.name);
        }
    }

    async leave(msg, params) {
        let index = this.playerIds.indexOf(msg.author.id);
        if (index !== -1) {
            this.playerIds.splice(index, 1);
            this.players.splice(index, 1);
            msg.reply("Left " + this.name);
        } else {
            msg.reply("You didn't leave " + this.name + " cuz u weren't a part of it in the first place :'(");
        }
    }

    async start(msg, params) {
        this.running = true;
        msg.reply("let's FUCKING GOOO");
    }

    async stop(msg, params) {
        this.running = false;
        msg.reply("Ok bye~ *fades away with Anna's voice*");
    }

    async handle(msg, params) {
        msg.reply("This was an extra request ;)");
    }

}

module.exports = Game;