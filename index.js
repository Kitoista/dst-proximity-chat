require('dotenv').config();
const Discord = require('discord.js');
const Commands = require('./commands.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const commands = new Commands(bot);

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content.startsWith('!')) {
        commands.handle(msg);
    }
});
