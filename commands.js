const { Message } = require("discord.js");
const Game = require("./games/game.js");
const TicTacToe = require("./games/tictactoe.js");

class Commands {

    constructor(bot) {
        this.bot = bot;
        this.connection = null;

        this.gameConstructors = {
            "game": Game,
            "tictactoe": TicTacToe,
        }
        this.games = {};
    }

    handle(msg) {
        let params = msg.content.substr(1).split(" ");
        let command = params[0];
        params.shift();
        try {
            if (typeof(this[command]) === 'function') {
                this[command](msg, params);
            } else if (this.gameConstructors[command]) {
                let game = this._getJoinedGame(msg, params);
                if (!game) {
                    msg.reply("You're not in any game");
                } else if (game.name.toLowerCase() !== command.toLowerCase()) {
                    msg.reply("You're not in " + command + " but in " + game.name + ", you silly");
                } else {
                    game.handle(msg, params);
                }
            }
        } catch (e) {
            msg.reply("Error: " + e);
            console.error(e);
        }
    }

    ping(msg) {
        // msg.reply('pong');
        msg.channel.send('pong');
    }
    
    kick(msg) {
        if (msg.mentions.users.size) {
            const taggedUser = msg.mentions.users.first();
            msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
        } else {
            msg.reply('Please tag a valid user!');
        }
    }

    async setVolume(msg, params) {
        const taggedUser = msg.mentions.users.first();
        
        let volume = Number.parseInt(params[1]);
        if (Number.isNaN(volume)) {
            volume = 0;
        }
        volume = volume < 0 ? 0 : volume > 200 ? 200 : volume;
        msg.reply(`I should set the volume for ${taggedUser.username} to ${volume}`);

        // console.log(this.bot.voice);
        // console.log(msg);
        // const user = msg.member.user;
        // msg.reply('This message was sent by: ' + username);
    }

    // async join(msg) {
    //     if (msg.member.voice.channel) {
    //         // msg.reply("Alright I'm joining to " + msg.member.voiceChannelID);
    //         // const voiceChannel = this.bot.channels.get(msg.member.voiceChannelID);
    //         this.connection = await msg.member.voice.channel.join();
    //     } else {
    //         msg.reply("Failed!!!");
    //     }
    // }

    // async leave(msg) {
    //     if (this.connection) {
    //         this.connection.disconnect();
    //     }
    // }

    async play(msg, params) {
        if (this.bot.voice.connections.size == 0) {
            await this.join(msg, params);
        }
        const stuff = ["windows_shutdown_earrape.mp3", "bruh.wav", "get_rekt.mp3", "i_came_looking_for_booty.wav", "thats_a_lot_of_damage.wav"];
        this.connection.play("C:\\Users\\Migiri\\Desktop\\sound effects\\" + stuff[Math.floor(Math.random() * stuff.length)]);
    }

    async test(msg) {
        // console.log(this.bot.voice.connections)
        // console.log(msg.author.id)

        // console.log(msg);
        // console.log(this.bot);

        let emojis = [ 
            ":grinning:",
            ":smiley:",
            ":smile:",
            ":grin:",
            ":laughing:",
            ":sweat_smile:",
            ":joy:",
            ":rofl:",
            ":relaxed:",
            ":blush:",
            ":innocent:",
            ":slight_smile:",
            ":upside_down:",
            ":wink:",
            ":relieved:",
            ":smiling_face_with_tear:",
            ":heart_eyes:",
            ":smiling_face_with_3_hearts:",
            ":kissing_heart:",
            ":kissing:",
            ":kissing_smiling_eyes:",
            ":kissing_closed_eyes:",
            ":yum:",
            ":stuck_out_tongue:",
            ":stuck_out_tongue_closed_eyes:",
            ":stuck_out_tongue_winking_eye:",
            ":zany_face:",
        ];
        let result = await msg.channel.send(emojis[0]);
        for (var i=0;i<1000;++i) {
            result = await result.edit(emojis[i%emojis.length])
        }
    }
    
    async song(msg, params) {
        if (this.bot.voice.connections.size == 0) {
            await this.join(msg, params);
        }
        const stuff = ["waterfalls.mp3"];
        this.connection.play("C:\\Users\\Migiri\\Music\\" + stuff[Math.floor(Math.random() * stuff.length)]);
    }

    async create(msg, params) {
        let gameName = params[0] ? params[0] : "game";
        // check if this player has a game
        if (Object.keys(this.games).includes(msg.author.id)) {
            msg.reply("One at a time pls");
        }
        // check if the game is even good
        else if (Object.keys(this.gameConstructors).includes(gameName)) { 
            let newGame = await new this.gameConstructors[gameName](this.bot, msg, params);
            this.games[newGame.owner.id] = newGame;
        }
        // ur fucked
        else {
            msg.reply("No such thing is " + gameName);
        }
    }

    _checkIfGameExists(msg, params) {
        // check if this player has a game
        if (!Object.keys(this.games).includes(msg.author.id)) {
            msg.reply("You don't even have a game -.-");
            return false;
        }
        return true;
    }

    _getGame(msg, params) {
        // check if the required game exists
        if (!Object.keys(this.games).includes(params[0])) {
            msg.reply("There's no such game -.-");
            return null;
        }
        return this.games[params[0]];
    }

    _getJoinedGame(msg, params) {
        let game = null;
        Object.keys(this.games).forEach(key => {
            if (this.games[key].playerIds.includes(msg.author.id)) {
                game = this.games[key];
                return;
            }
        });
        return game;
    }

    async start(msg, params) {
        if (!this._checkIfGameExists(msg, params)) { return; }
        let game = this.games[msg.author.id];
        game.start(msg, params);
    }

    async join(msg, params) {
        if (this._getJoinedGame(msg, params)) {
            msg.reply("You're in another game already");
            return;
        }
        let game = this._getGame(msg, params);
        if (!game) { return; }
        game.join(msg, params);
    }

    async leave(msg, params) {
        let game = this._getJoinedGame(msg, params);
        if (!game) { return; }
        game.leave(msg, params);
    }
    
    async stop(msg, params) {
        if (!this._checkIfGameExists(msg, params)) { return; }
        let game = this.games[msg.author.id];
        game.stop(msg, params);
        delete(this.games[msg.author.id]);
    }
}

module.exports = Commands;