const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Dominance V2 Hazır!');
});
app.listen(3000, () => {
  console.log('Bot sinyal veriyor...');
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} aktif edildi!`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!deneme') {
    message.reply('Dominance V2 emrinde kanka!');
  }
});

client.login(process.env.TOKEN);
