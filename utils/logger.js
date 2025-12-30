const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

async function sendLog(client, title, description, color) {
  try {
    const logChannel = client.channels.cache.get(config.logChannelId);
    
    if (!logChannel) {
      console.error(`Log kanalı bulunamadı: ${config.logChannelId}`);
      return;
    }
    
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: 'FiveM Kayıt Sistemi' });
    
    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Log gönderilemedi:', error);
  }
}

module.exports = { sendLog };