const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir kullanıcının kayıt sistemi banını kaldırır')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Banı kaldırılacak kullanıcı')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    try {
      const user = interaction.options.getUser('kullanıcı');
      
      
      const banlistPath = path.join(__dirname, '../data/banlist.json');
      const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
      
      if (!banlist[user.id]) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xFFA500)
              .setTitle('Kullanıcı Banlı Değil')
              .setDescription(`${user} (${user.id}) kullanıcısı kayıt sisteminden banlı değil.`)
              .setTimestamp()
          ]
        });
      }
      
      delete banlist[user.id];
      fs.writeFileSync(banlistPath, JSON.stringify(banlist, null, 2));
      
      
      try {
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0x00AE86)
              .setTitle('Kayıt Sistemi Banınız Kaldırıldı')
              .setDescription('Artık kayıt sistemini kullanabilirsiniz.')
              .setTimestamp()
              .setFooter({ text: '787 Bot Service' })
          ]
        });
      } catch (error) {
        console.error(`DM gönderilemedi: ${error}`);
      }
      
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Kullanıcının Banı Kaldırıldı')
            .setDescription(`${user} (${user.id}) kullanıcısının kayıt sistemi banı kaldırıldı.`)
            .addFields(
              { name: 'Yetkili', value: `${interaction.user} (${interaction.user.id})` }
            )
            .setTimestamp()
        ]
      });
      
      await sendLog(client, 'Kullanıcının Banı Kaldırıldı', `${user} (${user.id}) kullanıcısının kayıt sistemi banı ${interaction.user} tarafından kaldırıldı.`, 0x00AE86);
    } catch (error) {
      console.error('Unban komutunda hata:', error);
      await interaction.reply({
        content: 'Bir hata oluştu. Lütfen konsolu kontrol edin.',
        ephemeral: true
      });
    }
  }
};