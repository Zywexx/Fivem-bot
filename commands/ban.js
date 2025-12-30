const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı kayıt sisteminden banlar')
    .addUserOption(option =>
      option
        .setName('kullanıcı')
        .setDescription('Banlanacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('sebep')
        .setDescription('Ban sebebi')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    try {
      const user = interaction.options.getUser('kullanıcı');
      const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

      
      const banlistPath = path.join(__dirname, '../data/banlist.json');
      if (!fs.existsSync(banlistPath)) {
        fs.writeFileSync(banlistPath, JSON.stringify({}, null, 2));
      }
      const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));

      banlist[user.id] = {
        reason: reason,
        moderator: interaction.user.id,
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(banlistPath, JSON.stringify(banlist, null, 2));

      
      const registrationsPath = path.join(__dirname, '../data/registrations.json');
      if (!fs.existsSync(registrationsPath)) {
        fs.writeFileSync(registrationsPath, JSON.stringify({}, null, 2));
      }
      const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));

      if (registrations[user.id]) {
        const channelId = registrations[user.id].channelId;
        const channel = client.channels.cache.get(channelId);

        if (channel) {
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Kayıt Başvurusu İptal Edildi')
                .setDescription(
                  `${user} kullanıcısı kayıt sisteminden banlandığı için başvurusu iptal edildi.`
                )
                .setTimestamp()
            ]
          });

          setTimeout(async () => {
            try {
              await channel.delete();
            } catch (error) {
              console.error('Kanal silinemedi:', error);
            }
          }, 5000);
        }

        delete registrations[user.id];
        fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
      }

      
      try {
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('Kayıt Sisteminden Banlandınız')
              .setDescription(`Sebep: ${reason}`)
              .setTimestamp()
              .setFooter({ text: '787 Bot Service' })
          ]
        });
      } catch (error) {
        console.error('DM gönderilemedi:', error);
      }

      
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Kullanıcı Banlandı')
            .setDescription(`${user} (${user.id}) kayıt sisteminden banlandı.`)
            .addFields(
              { name: 'Sebep', value: reason },
              { name: 'Yetkili', value: `${interaction.user} (${interaction.user.id})` }
            )
            .setTimestamp()
        ]
      });

      
      await sendLog(
        client,
        'Kullanıcı Banlandı',
        `${user} (${user.id}) kullanıcısı ${interaction.user} tarafından banlandı. Sebep: ${reason}`,
        0xFF0000
      );

    } catch (error) {
      console.error('Ban komutunda hata:', error);

      if (!interaction.replied) {
        await interaction.reply({
          content: 'Bir hata oluştu. Lütfen konsolu kontrol edin.',
          ephemeral: true
        });
      }
    }
  }
};
