const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const { sendLog } = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      
      if (interaction.commandName === 'onay') {
        
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
          return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));

        if (!registrations[user.id]) {
          return interaction.reply({ content: `${user} kullanıcısının aktif bir kayıt başvurusu bulunmuyor.`, ephemeral: true });
        }

        try {
          const registrationData = registrations[user.id];
          const guild = await client.guilds.fetch(interaction.guild.id);
          const member = await guild.members.fetch(user.id);

          
          await member.roles.add(config.interviewRoleId);

          
          try {
            await user.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0x00AE86)
                  .setTitle('Kayıt Onaylandı!')
                  .setDescription('Kayıt başvurunuz bir yetkili tarafından onaylanmıştır. Artık mülakat rolüne sahipsiniz.')
                  .setTimestamp()
                  .setFooter({ text: '787 Bot Service' })
              ]
            });
          } catch (dmError) {
            console.error(`[DM Hatası] ${user.id} kullanıcısına DM gönderilemedi: ${dmError}`);
          }

          
          const channel = client.channels.cache.get(registrationData.channelId);
          if (channel) {
            await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0x00AE86)
                  .setTitle('Başvuru Onaylandı')
                  .setDescription(`Bu başvuru ${interaction.user} tarafından /onay komutuyla onaylandı. Kanal 5 saniye içinde silinecek.`)
              ]
            });
            setTimeout(() => channel.delete().catch(console.error), 5000);
          }

          
          delete registrations[user.id];
          fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle('✅ Başvuru Onaylandı')
                .setDescription(`${user} (${user.id}) kullanıcısının başvurusu başarıyla onaylandı ve mülakat rolü verildi.`)
            ]
          });

          await sendLog(client, 'Kayıt Onaylandı', `${user} (${user.id}) kullanıcısının kaydı ${interaction.user} tarafından /onay komutuyla onaylandı.`, 0x00AE86);

        } catch (error) {
          console.error('[/onay Komut Hatası]', error);
          await interaction.reply({ content: 'Bir hata oluştu. Lütfen konsolu kontrol edin.', ephemeral: true });
        }
        return; 
      }

      
      if (interaction.commandName === 'red') {
        
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
          return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));

        if (!registrations[user.id]) {
          return interaction.reply({ content: `${user} kullanıcısının aktif bir kayıt başvurusu bulunmuyor.`, ephemeral: true });
        }

        try {
          const registrationData = registrations[user.id];

          
          try {
            await user.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0xFF0000)
                  .setTitle('❌ Kayıt Reddedildi')
                  .setDescription('Maalesef kayıt başvurunuz bir yetkili tarafından reddedilmiştir.')
                  .setTimestamp()
                  .setFooter({ text: '787 Bot Service' })
              ]
            });
          } catch (dmError) {
            console.error(`[DM Hatası] ${user.id} kullanıcısına DM gönderilemedi: ${dmError}`);
          }

          
          const channel = client.channels.cache.get(registrationData.channelId);
          if (channel) {
            await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(0xFF0000)
                  .setTitle('Başvuru Reddedildi')
                  .setDescription(`Bu başvuru ${interaction.user} tarafından /red komutuyla reddedildi. Kanal 5 saniye içinde silinecek.`)
              ]
            });
            setTimeout(() => channel.delete().catch(console.error), 5000);
          }

          
          delete registrations[user.id];
          fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Başvuru Reddedildi')
                .setDescription(`${user} (${user.id}) kullanıcısının başvurusu reddedildi ve bilgilendirildi.`)
            ]
          });

          await sendLog(client, 'Kayıt Reddedildi', `${user} (${user.id}) kullanıcısının kaydı ${interaction.user} tarafından /red komutuyla reddedildi.`, 0xFF0000);

        } catch (error) {
          console.error('[/red Komut Hatası]', error);
          await interaction.reply({ content: 'Bir hata oluştu. Lütfen konsolu kontrol edin.', ephemeral: true });
        }
        return; 
      }
      
      
      if (command) {
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(`Komut çalıştırılırken hata: ${error}`);
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
          }
        }
      }
    }
    
    
    if (interaction.isButton()) {
      
      if (interaction.customId === 'register-button') {
        const banlistPath = path.join(__dirname, '../data/banlist.json');
        const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
        if (banlist[interaction.user.id]) {
          return interaction.reply({ content: 'Kayıt sisteminden banlandınız. Lütfen yetkililerle iletişime geçin.', ephemeral: true });
        }
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
        if (registrations[interaction.user.id]) {
          return interaction.reply({ content: 'Zaten aktif bir kaydınız bulunuyor. Lütfen bekleyin.', ephemeral: true });
        }
        const modal = new ModalBuilder().setCustomId('register-modal').setTitle('FiveM Ekip Kayıt Formu');
        config.modalQuestions.forEach((question, index) => {
          const textInput = new TextInputBuilder()
            .setCustomId(`question-${index}`).setLabel(question.label).setPlaceholder(question.placeholder)
            .setStyle(question.style === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short).setRequired(true);
          modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        });
        await interaction.showModal(modal);
        await sendLog(client, 'Kayıt Başlatıldı', `${interaction.user} (${interaction.user.id}) kayıt formunu açtı.`, 0x00AE86);
      }
      
      
      if (interaction.customId === 'approve-button') {
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
          return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }
        const userId = interaction.message.embeds[0].footer.text.split('ID: ')[1];
        const user = await client.users.fetch(userId);
        const member = await interaction.guild.members.fetch(userId);
        await member.roles.add(config.interviewRoleId);
        try {
          await user.send({ embeds: [new EmbedBuilder().setColor(0x00AE86).setTitle('Kayıt Onaylandı').setDescription('Kaydınız başarıyla onaylandı. Artık mülakat rolüne sahipsiniz.').setTimestamp().setFooter({ text: '787 Bot Service' })] });
        } catch (error) { console.error(`DM gönderilemedi: ${error}`); }
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
        delete registrations[userId];
        fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
        setTimeout(async () => { try { await interaction.channel.delete(); } catch (error) { console.error('Kanal silinemedi:', error); } }, 5000);
        await interaction.update({ content: '✅ Kayıt başarıyla onaylandı. Kullanıcıya mülakat rolü verildi ve DM ile bilgilendirildi.', components: [] });
        await sendLog(client, 'Kayıt Onaylandı', `${user} (${user.id}) kullanıcısının kaydı ${interaction.user} tarafından onaylandı.`, 0x00AE86);
      }
      
      
      if (interaction.customId === 'reject-button') {
        if (!interaction.member.roles.cache.has(config.adminRoleId)) {
          return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }
        const userId = interaction.message.embeds[0].footer.text.split('ID: ')[1];
        const user = await client.users.fetch(userId);
        try {
          await user.send({ embeds: [new EmbedBuilder().setColor(0xFF0000).setTitle('Kayıt Reddedildi').setDescription('Kaydınız yetkililer tarafından reddedildi. Daha sonra tekrar deneyebilirsiniz.').setTimestamp().setFooter({ text: '787 Bot Service' })] });
        } catch (error) { console.error(`DM gönderilemedi: ${error}`); }
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
        delete registrations[userId];
        fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
        setTimeout(async () => { try { await interaction.channel.delete(); } catch (error) { console.error('Kanal silinemedi:', error); } }, 5000);
        await interaction.update({ content: '❌ Kayıt reddedildi. Kullanıcıya DM ile bildirim gönderildi.', components: [] });
        await sendLog(client, 'Kayıt Reddedildi', `${user} (${user.id}) kullanıcısının kaydı ${interaction.user} tarafından reddedildi.`, 0xFF0000);
      }
    }
    
    
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'register-modal') {
        const answers = [];
        config.modalQuestions.forEach((_, index) => {
          answers.push(interaction.fields.getTextInputValue(`question-${index}`));
        });
        const channel = await interaction.guild.channels.create({
          name: `kayıt-${interaction.user.username}`, type: 0, parent: config.registerCategoryId,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
            { id: config.adminRoleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
          ]
        });
        const embed = new EmbedBuilder()
          .setColor(0x00AE86).setTitle('Yeni Kayıt Başvurusu')
          .setDescription(`${interaction.user} (${interaction.user.id}) kullanıcısından yeni bir kayıt başvurusu.`)
          .setThumbnail(interaction.user.displayAvatarURL()).setTimestamp()
          .setFooter({ text: `Kullanıcı ID: ${interaction.user.id}` });
        config.modalQuestions.forEach((question, index) => {
          embed.addFields({ name: question.label, value: answers[index] || 'Belirtilmemiş' });
        });
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('approve-button').setLabel('Onayla').setStyle(ButtonStyle.Success).setEmoji('✅'),
          new ButtonBuilder().setCustomId('reject-button').setLabel('Reddet').setStyle(ButtonStyle.Danger).setEmoji('❌')
        );
        await channel.send({ embeds: [embed], components: [row] });
        const registrationsPath = path.join(__dirname, '../data/registrations.json');
        const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
        registrations[interaction.user.id] = { channelId: channel.id, timestamp: new Date().toISOString(), answers: answers };
        fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
        await interaction.reply({ content: `Kayıt başvurunuz alındı! ${channel} kanalında başvurunuz incelenecek.`, ephemeral: true });
        await sendLog(client, 'Yeni Kayıt Başvurusu', `${interaction.user} (${interaction.user.id}) yeni bir kayıt başvurusu gönderdi. Kanal: ${channel}`, 0x00AE86);
      }
    }
  }
};