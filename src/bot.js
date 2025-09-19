require('dotenv').config();
const mineflayer = require('mineflayer');
const { 
    parseGuildChat, 
    sendGuildChatToDiscord, 
    sendMessageToDiscord, 
    stripMinecraftFormatting 
} = require('utils');
const WebSocket = require('ws');

const email = process.env.MINECRAFT_EMAIL;
const password = process.env.MINECRAFT_PASSWORD;
const server = process.env.MINECRAFT_SERVER || 'localhost';
const port = parseInt(process.env.MINECRAFT_PORT || '25565');
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

let bot;

function sendGuildChatMessage(msg) {
  if (bot && bot.player && bot.player.username) {
    bot.chat(`/gc ${msg}`);
  } else {
    console.log('Bot not ready, cannot send guild chat message.');
  }
}

function createBot() {
  console.log('Creating bot...');
  bot = mineflayer.createBot({
    host: server,
    port: port,
    auth: 'microsoft',
    username: email,
    password: password,
    version: false
  });

  bot.on('spawn', () => {
    console.log('Bot has joined the server!');
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (error) => {
    console.error('Bot encountered an error:', error);
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('message', (message) => {
    const msgStr = message.toString();
    const cleanMsg = stripMinecraftFormatting(msgStr);
    const guildData = parseGuildChat(msgStr);

    if (guildData) {
      if (guildData.name.toLowerCase() !== 'in-game-name') {
        sendGuildChatToDiscord(discordWebhookUrl, guildData);
      }
    } else if (cleanMsg.includes('has been kicked from the guild')) {
      sendMessageToDiscord(discordWebhookUrl, cleanMsg);
    } else if (cleanMsg.includes('has joined the guild!')) {
      sendMessageToDiscord(discordWebhookUrl, cleanMsg);
    } else if (cleanMsg.includes('left the guild!')) {
      sendMessageToDiscord(discordWebhookUrl, cleanMsg);
    }
  });
}

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected.');

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      sendGuildChatMessage(message.toString());
      return;
    }

    if (data.type === 'discord_message' && data.payload?.message) {
      sendGuildChatMessage(data.payload.message);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
  });
});

createBot();

module.exports = bot;