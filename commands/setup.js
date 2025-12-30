const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Kayıt butonunu kurar veya günceller')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    try {
      const registerChannel = client.channels.cache.get(config.registerChannelId);
      
      if (!registerChannel) {
        return interaction.reply({
          content: 'Kayıt kanalı bulunamadı. Lütfen config.json dosyasını kontrol edin.',
          ephemeral: true
        });
      }
      
      
      const messages = await registerChannel.messages.fetch({ limit: 10 });
      const botMessages = messages.filter(m => m.author.id === client.user.id);
      
      if (botMessages.size > 0) {
        await registerChannel.bulkDelete(botMessages);
      }
      
      
      const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle('FiveM Ekip Kayıt Sistemi')
        .setDescription('Aşağıdaki butona tıklayarak sunucumuza kayıt olabilirsiniz.')
        .setTimestamp()
        .setFooter({ text: '787 Bot Service' });
      
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('register-button')
            .setLabel('Kayıt Başlat')
            .setStyle(ButtonStyle.Success)
            .setEmoji('📝')
        );
      
      await registerChannel.send({ embeds: [embed], components: [row] });
      
      await interaction.reply({
        content: 'Kayıt butonu başarıyla oluşturuldu!',
        ephemeral: true
      });
      
      await sendLog(client, 'Sistem Kurulumu', `${interaction.user} tarafından kayıt butonu yeniden kuruldu.`, 0x00AE86);
    } catch (error) {
      console.error('Setup komutunda hata:', error);
      await interaction.reply({
        content: 'Bir hata oluştu. Lütfen konsolu kontrol edin.',
        ephemeral: true
      });
    }
  }
};